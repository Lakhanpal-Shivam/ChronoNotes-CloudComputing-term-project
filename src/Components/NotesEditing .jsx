import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Button,
} from "@chakra-ui/react";
import axios from "axios";
import {
  API_GET_NOTES_URL,
  API_PUT_NOTES_URL,
  API_SNS_URL,
} from "../util/URLs";

function NotesEditing({ note, isOpen, onClose, onEdit }) {
  const [noteText, setNoteText] = useState(note ? note.text : "");
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    onEdit(note, noteText);

    // Fetch ARN
    const response = await axios.get(API_GET_NOTES_URL);

    if (response.status === 200) {
      const allNotes = response.data;
      const noteWithArn = allNotes.find((n) => n.id === note.id);

      if (noteWithArn) {
        // Update note on backend
        const newNote = {
          title: note.title,
          text: noteText,
          id: note.id,
          isEditing: false,
        };
        const updateResponse = await axios.post(API_PUT_NOTES_URL, newNote);

        if (updateResponse.status === 200) {
          console.log("Note successfully updated");
        }

        const subscribeResponse = await axios.post(API_SNS_URL, {
          topicArn: noteWithArn.topicArn,
          message:
            "This is an update onto your subscribed notes : \n" + noteText,
          subject: "Update on your subscribed notes : " + note.title,
          isSubscribe: false,
          email: email,
        });

        if (subscribeResponse.status === 200) {
          console.log("Note subscription successful");
        }
      } else {
        console.log("Note not found:", note.id);
      }
    }

    onClose();
  };

  useEffect(() => {
    setNoteText(note ? note.text : "");
  }, [note]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            placeholder="Edit your note"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default NotesEditing;
