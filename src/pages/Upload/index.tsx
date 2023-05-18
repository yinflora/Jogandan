import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useContext, useState } from 'react';
import { CiCircleInfo } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components/macro';
import { v4 as uuidv4 } from 'uuid';
import Alert from '../../components/Alert';
import Button from '../../components/Button/Button';
import SingleForm from '../../components/SingleForm';
import { UserInfoContext } from '../../context/UserInfoContext';
import { FormInputsType } from '../../types/types';
import * as firebase from '../../utils/firebase';
import { BulkForm } from './BulkForm';
import image from './image.png';

const Container = styled.div`
  width: 1000px;
  margin: 150px auto 0;
  color: #fff;
  cursor: default;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

const SharedWrapper = styled.div<{ $hasBulkItems: boolean }>`
  display: flex;
  width: 100%;
  margin-bottom: ${({ $hasBulkItems }) => ($hasBulkItems ? 0 : '40px')};
  justify-content: space-between;
  align-items: end;
`;

const PageTitle = styled.h1`
  margin-right: 20px;
  font-size: 3rem;
  font-weight: 500;
  letter-spacing: 0.4rem;
  text-transform: uppercase;
`;

const ModeToggler = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const ModeText = styled.span<{ $isActive: boolean }>`
  letter-spacing: 0.1rem;
  color: ${({ $isActive }) =>
    $isActive ? '#fff' : 'rgba(255, 255, 255, 0.4)'};
  font-weight: ${({ $isActive }) => ($isActive ? 500 : 400)};
`;

const SwitchContainer = styled.div`
  display: inline-block;
  position: relative;
  width: 48px;
  height: 24px;

  &:hover::before {
    content: '⚠ 切換模式將會刪除已填入的資料';
    position: absolute;
    left: 50%;
    top: -30px;
    display: flex;
    width: max-content;
    transform: translateX(-50%);
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.3);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    border-radius: 5px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const Slider = styled.div<{ $checked: boolean }>`
  background-color: #ccc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 24px;
  transition: all 0.3s;
  background-color: ${({ $checked }) =>
    $checked ? 'rgb(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;

  &:before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s;
    transform: translateX(${({ $checked }) => ($checked ? '24px' : '0px')});
  }
`;

const Input = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
`;

const BulkUploadWrapper = styled.div`
  display: flex;
  margin-left: auto;
  gap: 20px;
`;

const InvisibleInput = styled.input`
  display: none;
`;

const PromptWrapper = styled.div`
  display: flex;
  height: 30px;
  gap: 5px;
  justify-content: center;
  align-items: center;

  & > .info {
    width: 20px;
    height: 20px;
    color: #000;
    stroke-width: 0.5px;
  }
`;

const PromptRemind = styled.span`
  letter-spacing: 0.1em;
  color: #000;
`;

const BulkTitleWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 80px;
  padding: 20px 0 10px;
  justify-content: end;
  align-items: flex-end;
`;

const SlideCount = styled.div`
  color: #fff;
`;

const NowIndex = styled.span`
  font-size: 1.5rem;
  letter-spacing: 0.4rem;
`;

const TotalIndex = styled.span`
  letter-spacing: 0.4rem;
`;

const BulkImageUpload = styled.div`
  display: flex;
  width: 100%;
  height: 500px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #fff;
  background-color: rgb(255, 255, 255, 0.2);
  gap: 10px;
`;

const ImageIcon = styled.img`
  width: 60px;
  height: 60px;
`;

const RemindWrapper = styled.div`
  display: flex;
  margin-bottom: 30px;
  flex-direction: column;
  gap: 10px;
`;

const Remind = styled.p`
  text-align: center;
  color: #fff;
`;

const Upload = () => {
  const BULK_LIMIT = 16;

  const { user, isPopout, setIsPopout } = useContext(UserInfoContext);
  const navigate = useNavigate();
  const [bulkForms, setBulkForms] = useState<FormInputsType[]>([]);
  const [isBulkMode, setIsBulkMode] = useState<boolean>(false);

  const handleSelectedImages = async (
    e: React.ChangeEvent<HTMLInputElement>,
    limit: number
  ) => {
    let files: FileList | null = e.target.files;

    if (!files) return;

    if (files.length > limit) {
      alert(`最多只能上傳${limit}張圖片`);
      files = null;
    }

    if (!files) return;

    const newBulkForms = [...bulkForms];

    for (let i = 0; i < files.length; i++) {
      const url = URL.createObjectURL(files[i]);
      newBulkForms.push({
        name: '',
        category: '',
        status: '',
        description: '',
        images: [url],
      });
    }

    setBulkForms(newBulkForms);
  };

  const handleUploadItem = async (form: FormInputsType) => {
    const newForm = { ...form };

    await Promise.all(
      newForm.images.map(async (formImage: string, imageIndex: number) => {
        if (formImage === '') {
          newForm.images[imageIndex] = '';
        } else if (formImage.includes('blob')) {
          const res = await fetch(formImage);
          const blobImage = await res.blob();

          const storageRef = ref(
            firebase.storage,
            `/${user.uid}/images/${uuidv4()}`
          );
          const snapshot = await uploadBytes(storageRef, blobImage);
          const url = await getDownloadURL(snapshot.ref);

          newForm.images[imageIndex] = url;
        }
      })
    );

    await firebase.uploadItem(newForm);
  };

  const handleSelectImage = () => {
    const uploadImage = document.getElementById('uploadImage');
    if (uploadImage) {
      uploadImage.click();
    }
  };

  return (
    <Container>
      {isPopout && (
        <Alert
          type="success"
          title="上傳成功！"
          buttonConfig={[
            {
              buttonType: 'dark',
              value: '確認結果',
              action: () => {
                navigate('/inventory');
              },
            },
          ]}
        />
      )}

      <TitleWrapper>
        <SharedWrapper $hasBulkItems={bulkForms.length > 0}>
          <PageTitle>UPLOAD</PageTitle>

          <ModeToggler>
            <ModeText $isActive={!isBulkMode}>單次</ModeText>
            <SwitchContainer>
              <Input
                id="switchUpload"
                type="checkbox"
                checked={isBulkMode}
                onChange={() => {
                  setIsBulkMode(!isBulkMode);
                  setBulkForms([]);
                }}
              />
              <label htmlFor="switchUpload">
                <Slider $checked={isBulkMode} />
              </label>
            </SwitchContainer>
            <ModeText $isActive={isBulkMode}>批次</ModeText>
          </ModeToggler>
        </SharedWrapper>

        {bulkForms.length > 0 && (
          <BulkTitleWrapper>
            <SlideCount>
              <NowIndex>{bulkForms.length}</NowIndex>
              <TotalIndex>/{BULK_LIMIT}</TotalIndex>
            </SlideCount>

            <BulkUploadWrapper>
              <InvisibleInput
                id="uploadImage"
                type="file"
                accept="image/*"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleSelectedImages(e, BULK_LIMIT - bulkForms.length)
                }
                multiple
              />
              <label htmlFor="uploadImage">
                <Button
                  buttonType="light"
                  onClick={handleSelectImage}
                  disabled={bulkForms.length === BULK_LIMIT}
                >
                  選擇照片
                </Button>
              </label>
              <Button
                buttonType="dark"
                onClick={() =>
                  Promise.all(
                    bulkForms.map((form) => handleUploadItem(form))
                  ).then(() => {
                    setIsPopout(!isPopout);
                    setBulkForms([]);
                  })
                }
                disabled={
                  !bulkForms
                    .map((form) => {
                      const { name, category, status } = form;
                      return name !== '' && category !== '' && status !== '';
                    })
                    .every(Boolean)
                }
              >
                確認上傳
              </Button>
            </BulkUploadWrapper>
          </BulkTitleWrapper>
        )}
      </TitleWrapper>

      {(() => {
        if (isBulkMode) {
          if (bulkForms.length === 0) {
            return (
              <BulkImageUpload>
                <ImageIcon src={image} />
                <RemindWrapper>
                  <Remind>選擇照片進行批量上傳</Remind>
                  <PromptWrapper>
                    <CiCircleInfo className="info" />
                    <PromptRemind>最多只能選擇 {BULK_LIMIT} 張</PromptRemind>
                  </PromptWrapper>
                </RemindWrapper>

                <InvisibleInput
                  id="uploadImage"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleSelectedImages(e, BULK_LIMIT - bulkForms.length)
                  }
                  multiple
                />
                <label htmlFor="uploadImage">
                  <Button buttonType="dark" onClick={handleSelectImage}>
                    選擇照片
                  </Button>
                </label>
              </BulkImageUpload>
            );
          }
          return <BulkForm bulkForms={bulkForms} setBulkForms={setBulkForms} />;
        }
        return <SingleForm />;
      })()}
    </Container>
  );
};

export default Upload;
