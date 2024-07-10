import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const getCSRFToken = async () => {
  try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
      console.log("CSRF token received:", response.data.csrfToken);
      return response.data.csrfToken;
  } catch (error) {
      console.error('Error fetching CSRF token:', error);
      throw error;
  }
};

const DeleteFolderModal = ({ show, onHide, folderName, folderId }) => {
  const handleDelete = async () => {
    try {
      const csrfToken = await getCSRFToken();
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}folders/${folderId}`,
      {
        headers: {
            'X-CSRFToken': csrfToken,
        }
      }
    );
      console.log('Folder deleted:', response.data);
      onHide(true); // Закрыть модальное окно и обновить UI при необходимости
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  return (
    <Modal show={show} onHide={() => onHide(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Удаление папки</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Вы действительно хотите удалить "{folderName}"? Это также удалит все вложенные категории и файлы.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{color: 'black'}} onClick={() => onHide(false)}>
          Отмена
        </Button>
        <Button variant="danger" style={{color: 'black'}} onClick={handleDelete}>
          Удалить
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteFolderModal;
