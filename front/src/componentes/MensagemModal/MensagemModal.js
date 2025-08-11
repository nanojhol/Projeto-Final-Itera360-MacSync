import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import styles from "./MensagemModal.module.css";
import { useNavigate } from "react-router-dom";

const MensagemModal = ({ show, onClose, titulo, mensagem, tipo, onClick }) => {
    const navigate = useNavigate();

    const handleClose = () => {
        onClose();
        if (onClick) {
            onClick();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className={tipo === 'sucesso' ? styles.sucesso : styles.erro}>
                <Modal.Title>{titulo}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{mensagem}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant={tipo === 'sucesso' ? "success" : "danger"} onClick={handleClose}>
                    Ok
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MensagemModal;
