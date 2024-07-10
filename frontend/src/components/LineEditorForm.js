import React, { useState, useEffect } from 'react';
import { calculateNewEndPoint } from './utils/mathUtils';
import Modal from './modal/Modal';
import './css/LineEditorForm.css';

const LineEditorForm = ({ isOpen, onClose, line, index, onUpdateLine, onDeleteLine, setLastLineEnds, lines }) => {
  
  const [length, setLength] = useState(Math.round(line.length));
  const [lengthmin, setLengthmin] = useState(Math.round(line.lengthmin));
  const [angle, setAngle] = useState(Math.round(line.angle));
  const [anglemin, setAnglemin] = useState(Math.round(line.anglemin));
  const [textAngle, setTextAngle] = useState(line.textAngle);
  const [editable, setEditable] = useState(line.editable);
  const [showtext, setShowtext] = useState(line.showtext);
  const [text, setText] = useState(line.text);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLength(Math.round(line.length));
    setLengthmin(Math.round(line.lengthmin));
    setAngle(Math.round(line.angle));
    setAnglemin(Math.round(line.anglemin));
    setTextAngle(line.textAngle);
    setEditable(line.editable);
    setShowtext(line.showtext);
    setText(line.text);
  }, [line]);

  const handleUpdate = () => {
    const np = lines[index].points;
    const newEndPoint = calculateNewEndPoint(np[0], np[1], np[2], np[3], line.length);
    if (error) {
      setError(error);
    } else {
      setError(null);
     
        const updatedLine = {
            ...line,
            points: [np[0], np[1], newEndPoint.x2, newEndPoint.y2],
            length: `${Math.round(length)}`,
            lengthmin: lengthmin > length ? `${Math.round(length)}` : lengthmin, 
            angle: angle,
            anglemin: anglemin, 
            editable: editable,
            showtext: showtext,
            text: text,
            textAngle: textAngle,
        };
        setLastLineEnds([np[0], np[1], newEndPoint.x2, newEndPoint.y2, angle]); // Обновляем конечную точку для новой линии
        onUpdateLine(updatedLine, index);
    }
};
  
  const handleDelete = () => {
    onDeleteLine(index);
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
    <form className="form-container">
        <h3>Редактирование линии</h3>
        
        <div className="form-row">
            <label>Макс. длина:</label>
            <input type="number" value={length} onChange={(e) => setLength(parseFloat(e.target.value))}/>
        </div>
        
        <div className="form-row">
            <label>Мин. Длина:</label>
            <input type="number" value={lengthmin} onChange={(e) => setLengthmin(parseFloat(e.target.value))}/>
        </div>
        
        <div className="form-row">
            <label>Текст:</label>
            <input type="number" value={text} onChange={(e) => setText(parseFloat(e.target.value))}/>
        </div>
        
        <div className="form-row">
            <label>Угол:</label>
            <input type="number" value={textAngle} onChange={(e) => setTextAngle(parseFloat(e.target.value))}/>
        </div>
        
        <div className="form-row">
            <label>Мин. Угол:</label>
            <input type="number" value={anglemin} onChange={(e) => setAnglemin(parseFloat(e.target.value))}/>
        </div>
        
        <div className="form-row">
            <label>Показать угол:</label>
            <input type="checkbox" checked={editable} onChange={(e) => setEditable(e.target.checked)}/>
            
            <label>Показать длину:</label>
            <input type="checkbox" checked={showtext} onChange={(e) => setShowtext(e.target.checked)}/>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-row">
            <button type="button" className="btn btn-outline-dark mx-1 mt-2" onClick={handleUpdate}>
                Изменить
            </button>
            <button type="button" className="btn btn-outline-dark mx-1 mt-2" onClick={handleDelete}>
                Удалить
            </button>
        </div>
    </form>
</Modal>

  );
};

export default LineEditorForm;
