import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import UserInfoContext from '../../context/UserInfoContext';
import { FormInputs } from '../../types/types';
import { storage, updateItem, uploadItem } from '../../utils/firebase';
import Alert from '../Alert';
import Button from '../Button/Button';
import { ImageForm } from './ImageForm';
import { InputForm } from './InputForm';

const Container = styled.div`
  display: flex;
  width: 100%;
  height: min-content;
  gap: 30px;
`;

const useSingleForm = (id: string | undefined) => {
  const SINGLE_LIMIT = 8;
  const { items } = useContext(UserInfoContext);
  const [singleForm, setSingleForm] = useState<FormInputs>({
    name: '',
    category: '',
    status: '',
    description: '',
    images: Array(SINGLE_LIMIT).fill(''),
  });

  useEffect(() => {
    if (!id) return;

    const selectedItem = items.find((item) => item.id === id);

    if (!selectedItem) return;
    const { name, category, status, description, images } = selectedItem;
    const filledImages = new Array(SINGLE_LIMIT)
      .fill('')
      .map((_, i) => images[i] || '');

    setSingleForm({
      name,
      category,
      status,
      description,
      images: filledImages,
    });
  }, [items]);

  return { singleForm, setSingleForm };
};

const index = () => {
  const { user, isPopout, setIsPopout } = useContext(UserInfoContext);
  const { id } = useParams();
  const { singleForm, setSingleForm } = useSingleForm(id);
  const navigate = useNavigate();

  const handleUploadItem = async () => {
    //!Fixme: 上傳失敗而且會重新整理
    const newForm = { ...singleForm };

    await Promise.all(
      newForm.images.map(async (image: string, imageIndex: number) => {
        if (image === '') {
          newForm.images[imageIndex] = '';
        } else if (!image.includes('https://')) {
          const res = await fetch(image);
          const blobImage = await res.blob();

          const storageRef = ref(storage, `/${user.uid}/images/${uuidv4()}`);
          const snapshot = await uploadBytes(storageRef, blobImage);
          const url = await getDownloadURL(snapshot.ref);

          newForm.images[imageIndex] = url;
        }
      })
    );

    if (id) {
      await updateItem(id, newForm);
    } else {
      await uploadItem(newForm);
    }
  };

  return (
    <>
      {isPopout && (
        <Alert
          type="success"
          title={id ? '儲存成功！' : '上傳成功！'}
          buttonConfig={[
            {
              buttonType: 'dark',
              value: '確認結果',
              action: () => {
                if (id) {
                  navigate(`/inventory/${id}`);
                } else {
                  navigate('/inventory');
                }
              },
            },
          ]}
        />
      )}

      <Container>
        <ImageForm singleForm={singleForm} setSingleForm={setSingleForm} />

        <InputForm singleForm={singleForm} setSingleForm={setSingleForm}>
          <Button
            buttonType="dark"
            width="100%"
            onClick={() => {
              handleUploadItem();
              setIsPopout(!isPopout);
            }}
            disabled={
              singleForm.name === '' ||
              singleForm.category === '' ||
              singleForm.status === '' ||
              !singleForm.images.some((image) => image !== '')
            }
          >
            {id ? '確認更新' : '確認上傳'}
          </Button>
        </InputForm>
      </Container>
    </>
  );
};

export default index;
