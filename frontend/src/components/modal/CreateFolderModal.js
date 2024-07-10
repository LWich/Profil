import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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

function CreateFolderModal({ show, handleClose, parent, onFolderCreated }) {
    const [folderName, setFolderName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        if (!folderName) return; // Check for empty folder name
        setLoading(true);
        try {
            const csrfToken = await getCSRFToken();
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}folders/`, {
                name: folderName,
                parent: parent,
                public: isPublic // Include the public state in the request
            },
            {
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/json' // Ensure the correct content type
                }
            });
            console.log('Folder created:', response.data);
            onFolderCreated(response.data);
            handleClose(); // Close the modal after successful creation
        } catch (error) {
            console.error('Error creating folder:', error);
            alert('Error creating folder: ' + error.message); // Display an alert message for better user feedback
        } finally {
            setLoading(false);
            setFolderName(''); // Reset the form after submission
            setIsPublic(false); // Reset the public checkbox
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Создать новую папку</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Имя папки</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите имя папки"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Check
                            type="checkbox"
                            label="Публичная папка"
                            checked={isPublic}
                            onChange={(e) => setIsPublic(e.target.checked)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" style={{color: "black"}} onClick={handleSave} disabled={loading}>
                    Сохранить
                </Button>
                <Button variant="secondary" style={{color: "black"}} onClick={handleClose}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateFolderModal;
