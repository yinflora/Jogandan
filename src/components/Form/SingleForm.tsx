export default function SingleForm() {
  return (
    <UploadContainer>
      <ImageWrapper>
        <ImageArea>
          <SubImageContainer
            ref={containerRef}
            onDragOver={(e) => handleDragOver(e)}
          >
            {singleForm.images.map((image, index) => (
              <SubImageWrapper
                key={index}
                onDragOver={(e) => handleDragOverImg(e, index)}
                onDrop={(e) => image !== '' && handleDrop(e, index)}
              >
                <div
                  draggable={singleForm.images[index] !== ''}
                  onDragStart={(e: React.DragEvent<HTMLDivElement>) => {
                    e.currentTarget.style.opacity = '0.01';
                    setDraggingIndex(index);
                  }}
                  onDragEnd={(e: React.DragEvent<HTMLDivElement>) => {
                    e.currentTarget.style.opacity = '1';
                    setDraggingIndex(null);
                  }}
                >
                  <SubImage imageUrl={image} />
                  {singleForm.images[index] !== '' && (
                    <CancelBtn onClick={() => handleDeleted(index)}>
                      <RxCross1 />
                    </CancelBtn>
                  )}
                  {index === 0 && <CoverText>封面</CoverText>}
                </div>
              </SubImageWrapper>
            ))}
          </SubImageContainer>
          {showCamera ? (
            <VideoWrapper>
              <Video ref={videoRef} autoPlay />
              <PhotoIcon src={photo} onClick={takePhoto} />
              <CancelIcon onClick={stopCamera}>
                {/* <Cross size={50} lineWidth={3} /> */}
                <RxCross1 className="close" />
              </CancelIcon>
            </VideoWrapper>
          ) : (
            <MainImageWrapper>
              <MainImage>
                <RemindWrapper>
                  <ImageIcon src={image} />
                  <Remind style={{ marginBottom: 30 }}>
                    最多上傳 {SINGLE_LIMIT} 張
                  </Remind>
                  <Button
                    buttonType="normal"
                    onClick={() => setShowCamera(true)}
                  >
                    拍照上傳
                  </Button>
                  <input
                    id="uploadImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      handleFileUpload(
                        e,
                        SINGLE_LIMIT -
                          singleForm.images.filter((item) => item !== '').length
                      )
                    }
                    multiple
                    capture
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="uploadImage">
                    <Button buttonType="normal" onClick={handleSelectImage}>
                      選擇照片
                    </Button>
                  </label>
                </RemindWrapper>
              </MainImage>
            </MainImageWrapper>
          )}
        </ImageArea>
        <ImageInfoWrapper>
          {singleForm.images.findIndex((image) => image === '') > 1 && (
            <PromptWrapper isBulkMode={isBulkMode}>
              <CiCircleInfo className="info" />
              <PromptRemind color="#fff">拖拉照片調整位置</PromptRemind>
            </PromptWrapper>
          )}

          <SlideCount>
            <NowIndex>
              {singleForm.images.filter((image) => image !== '').length}
            </NowIndex>
            <TotalIndex>/{singleForm.images.length}</TotalIndex>
          </SlideCount>
        </ImageInfoWrapper>
      </ImageWrapper>
      <InfoWrapper>
        <FieldWrapper>
          <FiledLabelMust>名稱</FiledLabelMust>

          <TextInput
            type="text"
            value={singleForm.name}
            onChange={(e) =>
              setSingleForm({ ...singleForm, name: e.target.value })
            }
          />
        </FieldWrapper>
        <SelectWrapper>
          <HalfFieldWrapper>
            <FiledLabelMust>分類</FiledLabelMust>
            <SelectInput
              onChange={(e) =>
                setSingleForm({ ...singleForm, category: e.target.value })
              }
            >
              {CATEGORY_OPTIONS.map((option) => (
                <SelectOption
                  key={option}
                  value={option}
                  selected={option === singleForm.category}
                >
                  {option}
                </SelectOption>
              ))}
            </SelectInput>
          </HalfFieldWrapper>
          <HalfFieldWrapper>
            <FiledLabelMust>狀態</FiledLabelMust>
            <SelectInput
              onChange={(e) =>
                setSingleForm({ ...singleForm, status: e.target.value })
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <SelectOption
                  key={option}
                  value={option}
                  selected={option === singleForm.status}
                >
                  {option}
                </SelectOption>
              ))}
            </SelectInput>
          </HalfFieldWrapper>
        </SelectWrapper>
        <FieldWrapper>
          <FiledLabel>描述</FiledLabel>
          <Description
            value={singleForm.description}
            onChange={(e) =>
              setSingleForm({ ...singleForm, description: e.target.value })
            }
            rows={5}
            cols={33}
          />
        </FieldWrapper>
        <Button
          buttonType="dark"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            isEdit ? handleUpdateItems() : handleUploadItems(singleForm);
            setIsPopout(!isPopout);
          }}
          disabled={
            singleForm.name === '' ||
            singleForm.category === '' ||
            singleForm.status === '' ||
            !singleForm.images.some((image) => image !== '')
          }
        >
          {isEdit ? '確認更新' : '確認上傳'}
        </Button>
      </InfoWrapper>
    </UploadContainer>
  );
}
