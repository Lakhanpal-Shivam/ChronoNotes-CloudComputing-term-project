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
  REACT_APP_API_GETDATA,
  REACT_APP_API_PUTDATA,
  REACT_APP_API_SNS,
  REACT_APP_API_TEXT,
} from "../util/URLs";

function NotesEditing({ note, isOpen, onClose, onEdit }) {
  const [noteText, setNoteText] = useState(note ? note.text : "");
  const [email, setEmail] = useState("");

  const handleSave = async () => {
    // Update note text
    onEdit(note, noteText);

    // Fetch ARN
    const response = await axios.get(REACT_APP_API_GETDATA);

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
        const updateResponse = await axios.post(REACT_APP_API_PUTDATA, newNote);

        if (updateResponse.status === 200) {
          console.log("Note successfully updated");
        }

        // Subscribe note
        const subscribeResponse = await axios.post(REACT_APP_API_SNS, {
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

    // Close modal
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
