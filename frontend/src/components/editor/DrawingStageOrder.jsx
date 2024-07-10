import React, { useState } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import ImageComponent from './ImageComponent';
import axios from 'axios';
import Konva from 'konva';
import Modal from '../modal/Modal';
import SaveButton from './SaveButton';
import { calculateNewEndPoint } from '../utils/mathUtils';
import '../css/DrawingCanvas.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const dataURLtoFile = (dataurl, filename) => {
  let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
  bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type:mime});
};

const getCSRFToken = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
  console.log("CSRF token received:", response.data.csrfToken);
  return response.data.csrfToken;
};

const DrawingStageOrder = ({
  lines,
  shapes,
  setLines,
  setShapes, 
  stageRef,
  folderId,
  drawing
}) => {
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [currentLine, setCurrentLine] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [scale, setScale] = useState(1);
  const [downloadCheck, setDownloadCheck] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);


  const toggleEditModal = () => {
    setEditModalOpen(!isEditModalOpen);
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleLineClick = (line, index) => {
    if (line.length === line.lengthmin) {
      // Если длина равна минимальной длине, ничего не делаем
      return;
    }
    setCurrentLine(line);
    setCurrentIndex(index);
    toggleEditModal();
  };

  const saveImage = async () => {
    if (!fileName.trim()) {
      alert('Please enter a valid file name.');
      return;
    }
  
    const stage = stageRef.current;
    const width = stage.width();
    const height = stage.height();
  
    // Создание белого фона и сохранение изображения
    const whiteLayer = new Konva.Layer();
    const whiteRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: 'white',
    });
    whiteLayer.add(whiteRect);
    stage.add(whiteLayer);
    whiteLayer.moveToBottom();
    stage.draw();
  
    const dataURL = stage.toDataURL({ mimeType: 'image/jpeg', quality: 1 });
    const file = dataURLtoFile(dataURL, `${fileName.trim()}.jpg`);
    const csrfToken = await getCSRFToken();
  
    whiteLayer.destroy();
    stage.draw();
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folderId);
    formData.append('name', file.name);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}upload/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken, 
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);

      // Используем download_url для скачивания файла
      const downloadUrl = `${process.env.REACT_APP_DOWNLOAD_URL}${response.data.download_url}`;
      if (downloadUrl && downloadCheck) {
        downloadFile(downloadUrl);
      }

    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
    }
    toggleModal(); // Закрыть модальное окно после загрузки
  };

  // Функция для скачивания файла
  const downloadFile = (downloadUrl) => {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', true); // Указываем, что это загрузка файла
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCheckChange = () => {
    setDownloadCheck(!downloadCheck); // Инвертировать значение чекбокса при изменении состояния
  };

  const handleLineUpdate = (updatedLine) => {
    if (updatedLine.text < updatedLine.lengthmin || updatedLine.text > updatedLine.length ) {
      setErrorMessage(`Ошибка: ${updatedLine.lengthmin} < Длина < ${updatedLine.length}.`);
      return;
    }
    const { points, text } = updatedLine;
    const [x1, y1, x2, y2] = points.map(Number);
    
    const newEndPoint = calculateNewEndPoint(x1, y1, x2, y2, text);
    
    const newLines = [...lines];
    
    const oldEndX = newLines[currentIndex].points[2]; // Старая координата X конечной точки
    const oldEndY = newLines[currentIndex].points[3]; // Старая координата Y конечной точки

  console.log('oldEndX', oldEndX);
  console.log('oldEndY', oldEndY);
    
    const newEndX = newEndPoint.x2; // Новая координата X конечной точки
    const newEndY = newEndPoint.y2; // Новая координата Y конечной точки

    console.log('newEndX', newEndX);
    console.log('newEndY', newEndY);
    
    const deltaX = newEndX - oldEndX; // Разница по X
    const deltaY = newEndY - oldEndY; // Разница по Y

    newLines[currentIndex] = {
      ...updatedLine,
      points: [x1, y1, newEndPoint.x2, newEndPoint.y2],
      text: updatedLine.text,
      textX: updatedLine.textX += deltaX / 2,
      textY: updatedLine.textY += deltaY / 2,
      textAngleX: updatedLine.textAngleX += deltaX,
      textAngleY: updatedLine.textAngleY += deltaY,
    };
    
    // Применяем сдвиг ко всем последующим линиям
    for (let i = currentIndex + 1; i < newLines.length; i++) {
      newLines[i].points = newLines[i].points.map((point, index) => 
        index % 2 === 0 ? point + deltaX : point + deltaY
      );
      newLines[i].textX += deltaX;
      newLines[i].textY += deltaY;
      newLines[i].textAngleX += deltaX;
      newLines[i].textAngleY += deltaY;
    }
    
    setLines(newLines);
    setCurrentIndex(null);
    setCurrentLine(null);
    toggleEditModal();
  };

  const handleEditModalClose = () => {
    setCurrentIndex(null);
    setCurrentLine(null);
    toggleEditModal();
  };

  const handleMouseEnter = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'pointer';  // Изменение курсора на pointer
    }
  };

  const handleMouseLeave = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'default';  // Возвращение курсора к стандартному виду
    }
  };

  const handleWheel = e => {
    if (!drawing) { // Проверяем, не активно ли сейчас рисование
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
        setScale(newScale);
    }
  };


  return (
    <div className='row'>
      <div className='col-2'>
      <SaveButton lines={lines} shapes={shapes} folderId={folderId} />
      <button className="btn btn-outline-dark mx-1" onClick={toggleModal}>Save as JPG</button>
      </div>
      <div className='col-10'>
      <Stage
        width={window.innerWidth} 
        height={window.innerHeight} 
        onWheel={handleWheel} 
        scaleX={scale} 
        scaleY={scale}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, index) => {
            console.log(line);
            const textAngle = line.textAngle;
            const text = line.text;
            const length = line.length;
            const lengthmin = line.lengthmin;
            const anglemin = line.anglemin;
            const isSelected = index === currentIndex;

            return (
              <React.Fragment key={index}>
                <Line
                  id={line.id}
                  points={line.points.map(Number)} // Преобразование всех точек в числа
                  stroke={isSelected ? "red" : "black"}
                  strokeWidth={2}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleLineClick(line, index)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                {(line.showtext) && (
                <Text
                  x={line.textX}
                  y={line.textY}
                  text={(text > 0) ? `${text}` : `${Math.round(lengthmin)} - ${Math.round(length)}`}
                  fontSize={12}
                  fill={length > lengthmin ? "black" : "red"} 
                  draggable
                  onDragEnd={(e) => {
                    // Обновить положение текста при перетаскивании
                    const newLines = [...lines];
                    newLines[index] = {
                      ...newLines[index],
                      textX: e.target.x(),
                      textY: e.target.y()
                    };
                    console.log("newLines:", newLines);
                    setLines(newLines);
                  }}
                />
                )}
                {line.editable && (
                  <Text
                    x={line.textAngleX}
                    y={line.textAngleY} // Чуть ниже середины линии
                    text={textAngle <= anglemin ? `${textAngle}` : `${anglemin} - ${textAngle}`}
                    fontSize={12}
                    fill={textAngle > anglemin ? "black" : "red"}
                    draggable
                    onDragEnd={(e) => {
                      const newLines = [...lines];
                      newLines[index] = {
                        ...newLines[index],
                        textAngleX: e.target.x(),
                        textAngleY: e.target.y()
                      };
                      setLines(newLines);
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
          {shapes.map((shape, index) => (
            <ImageComponent
              key={index}
              shapeProps={shape}
              onChange={(newAttrs) => {
                const newShapes = shapes.slice();
                newShapes[index] = newAttrs;
                setShapes(newShapes);
              }}
            />
          ))}
        </Layer>
      </Stage>
      </div>
      
      
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div>
          <h4>Enter file name:</h4>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name"
          />
          <div>
            <input
              type="checkbox"
              checked={downloadCheck}
              onChange={handleDownloadCheckChange}
            />
            <label>Скачать файл</label>
          </div>
          <button onClick={saveImage}>Save File</button>
        </div>
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose}>
        {currentLine && (
          <div>
            <label>
              Длина (от {Math.round(currentLine.lengthmin)} до {Math.round(currentLine.length)}):
              <input
                type="number"
                value={currentLine.text}
                onChange={(e) => setCurrentLine({ ...currentLine, text: Number(e.target.value) })}
              />
            </label>
            
            <label>
              Угол (от {Math.round(currentLine.anglemin)} до {Math.round(currentLine.textAngle)}):
              <input
                type="number"
                value={currentLine.textAngle}
                onChange={(e) => setCurrentLine({ ...currentLine, textAngle: Number(e.target.value) })}
              />
            </label>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button onClick={() => handleLineUpdate(currentLine)}>Update Line</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DrawingStageOrder;
