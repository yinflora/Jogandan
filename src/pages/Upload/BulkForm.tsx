import React from 'react';
import { RxCross1 } from 'react-icons/rx';
import styled, { css } from 'styled-components';
import {
  categoryOptions,
  statusOptions,
} from '../../components/SingleForm/InputForm';
import { FormInputsType } from '../../types/types';

type BulkFormPropsType = {
  bulkForms: FormInputsType[];
  setBulkForms: React.Dispatch<React.SetStateAction<FormInputsType[]>>;
};

const formInputs = [
  {
    label: '名稱',
    key: 'name',
    type: 'input',
    isRequire: true,
  },
  {
    label: '分類',
    key: 'category',
    type: 'select',
    isRequire: true,
    options: categoryOptions,
  },
  {
    label: '狀態',
    key: 'status',
    type: 'select',
    isRequire: true,
    options: statusOptions,
  },
  { label: '描述', key: 'description', type: 'textarea', isRequire: false },
];

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
`;

const ItemWrapper = styled.div`
  position: relative;
  display: flex;
  width: calc(50% - 10px);
  height: 250px;
  padding: 25px;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
`;

const Image = styled.div<{ $url: string }>`
  width: 200px;
  height: 200px;
  object-fit: cover;
  object-position: center;
  border: 1px solid #fff;
  background: ${({ $url }) => `center / cover no-repeat url(${$url})`};
`;

const CancelButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: 25px;
  height: 25px;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  color: #000;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
  }
`;

const InfoWrapper = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const FieldWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #fff;

  &:last-of-type {
    flex-direction: column;
    align-items: flex-start;
    border: none;
  }
`;

const FieldLabel = styled.label<{ $isRequire: boolean }>`
  width: 45px;
  line-height: 30px;
  letter-spacing: 0.1rem;

  ${({ $isRequire }) =>
    $isRequire &&
    css`
      position: relative;

      &::before {
        content: '*';
        position: absolute;
        top: -5px;
        right: 0;
        color: #fff;
      }
    `}
`;

const TextInput = styled.input`
  width: calc(100% - 45px);
  height: 30px;
  padding-left: 15px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  color: #fff;
`;

const SelectInput = styled.select`
  width: calc(100% - 45px);
  height: 30px;
  padding-left: 10px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  color: #fff;
  cursor: pointer;
`;

const SelectOption = styled.option`
  color: #000;
`;

const Description = styled.textarea`
  width: 100%;
  padding: 10px;
  resize: none;
  border: 1px solid #fff;
  outline: none;
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.25rem;
  background-color: transparent;
  color: #fff;
`;

export const BulkForm = ({ bulkForms, setBulkForms }: BulkFormPropsType) => {
  const handleBulkDelete = (index: number) => {
    const newForms = [...bulkForms];
    newForms.splice(index, 1);
    setBulkForms(newForms);
  };

  return (
    <Container>
      {bulkForms.map((form: FormInputsType, formIndex: number) => (
        <ItemWrapper key={formIndex}>
          <CancelButton onClick={() => handleBulkDelete(formIndex)}>
            <RxCross1 />
          </CancelButton>
          <Image $url={form.images[0]} />
          <InfoWrapper>
            {formInputs.map((input) => {
              let fieldElement = null;
              switch (input.type) {
                case 'input':
                  fieldElement = (
                    <TextInput
                      type="text"
                      value={form[input.key]}
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[formIndex][input.key] = e.target.value;
                        setBulkForms(newForm);
                      }}
                    />
                  );
                  break;
                case 'select':
                  fieldElement = (
                    <SelectInput
                      value={form[input.key]}
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[formIndex][input.key] = e.target.value;
                        setBulkForms(newForm);
                      }}
                    >
                      {input.options?.map((option) => (
                        <SelectOption key={option} value={option}>
                          {option}
                        </SelectOption>
                      ))}
                    </SelectInput>
                  );
                  break;
                case 'textarea':
                  fieldElement = (
                    <Description
                      value={form[input.key]}
                      onChange={(e) => {
                        const newForm = [...bulkForms];
                        newForm[formIndex][input.key] = e.target.value;
                        setBulkForms(newForm);
                      }}
                    />
                  );
                  break;
              }
              return (
                <FieldWrapper key={input.key}>
                  <FieldLabel $isRequire={input.isRequire}>
                    {input.label}
                  </FieldLabel>
                  {fieldElement}
                </FieldWrapper>
              );
            })}
          </InfoWrapper>
        </ItemWrapper>
      ))}
    </Container>
  );
};
