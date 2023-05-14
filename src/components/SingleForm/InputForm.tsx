import React from 'react';
import styled, { css } from 'styled-components';
import { FormInputsType } from '../../types/types';

const FormWrapper = styled.form`
  display: flex;
  padding: 5px 0 45px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: space-between;
`;

const FieldWrapper = styled.div<{ $width: string }>`
  display: flex;
  width: ${({ $width }) => $width};
  flex-direction: column;
  gap: 10px;
`;

const FieldLabel = styled.label<{ $isRequire: boolean }>`
  letter-spacing: 0.1rem;

  ${({ $isRequire }) =>
    $isRequire &&
    css`
      position: relative;

      &::before {
        content: '*';
        position: absolute;
        top: -5px;
        left: 40px;
        color: #fff;
      }

      &:hover::after {
        content: '必填';
        position: absolute;
        top: -5px;
        left: 50px;
        padding: 5px;
        background-color: rgba(0, 0, 0, 0.3);
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.8);
        border-radius: 5px;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
      }
    `}
`;

const TextInput = styled.input`
  width: 100%;
  height: 30px;
  padding-left: 5px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
`;

const SelectInput = styled.select`
  height: 30px;
  font-size: 1rem;
  letter-spacing: 0.1rem;
  border-bottom: 1px solid #fff;
  color: #fff;
  cursor: pointer;
`;

const SelectOption = styled.option`
  color: #000;
`;

const Description = styled.textarea`
  width: 100%;
  min-height: 100px;
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

export const categoryOptions = [
  '請選擇類別',
  '居家生活',
  '服飾配件',
  '美妝保養',
  '3C產品',
  '影音產品',
  '書報雜誌',
  '體育器材',
  '寵物用品',
  '食物及飲料',
  '興趣及遊戲',
  '紀念意義',
  '其他',
];
export const statusOptions = ['請選擇狀態', '保留', '待處理', '已處理'];
const formInputs = [
  {
    label: '名稱',
    key: 'name',
    type: 'input',
    isRequire: true,
    width: '100%',
  },
  {
    label: '分類',
    key: 'category',
    type: 'select',
    isRequire: true,
    options: categoryOptions,
    width: '47%',
  },
  {
    label: '狀態',
    key: 'status',
    type: 'select',
    isRequire: true,
    options: statusOptions,
    width: '47%',
  },
  {
    label: '描述',
    key: 'description',
    type: 'textarea',
    isRequire: false,
    width: '100%',
  },
];

type InputFormProps = {
  singleForm: FormInputsType;
  setSingleForm: React.Dispatch<React.SetStateAction<FormInputsType>>;
  children: React.ReactNode;
};

export const InputForm = ({
  singleForm,
  setSingleForm,
  children,
}: InputFormProps) => {
  return (
    <FormWrapper onSubmit={(e) => e.preventDefault()}>
      {formInputs.map((input) => {
        let fieldElement = null;
        switch (input.type) {
          case 'input':
            fieldElement = (
              <TextInput
                type="text"
                value={singleForm[input.key]}
                onChange={(e) =>
                  setSingleForm({
                    ...singleForm,
                    [input.key]: e.target.value,
                  })
                }
              />
            );
            break;
          case 'select':
            fieldElement = (
              <SelectInput
                value={singleForm[input.key]}
                onChange={(e) =>
                  setSingleForm({
                    ...singleForm,
                    [input.key]: e.target.value,
                  })
                }
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
                value={singleForm[input.key]}
                onChange={(e) =>
                  setSingleForm({
                    ...singleForm,
                    [input.key]: e.target.value,
                  })
                }
              />
            );
            break;
        }
        return (
          <FieldWrapper key={input.key} $width={input.width}>
            <FieldLabel $isRequire={input.isRequire}>{input.label}</FieldLabel>
            {fieldElement}
          </FieldWrapper>
        );
      })}
      {children}
    </FormWrapper>
  );
};
