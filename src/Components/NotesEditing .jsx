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

function NotesEditing({ note, isOpen, onClose, onEdit }) {
  const [noteText, setNoteText] = useState(note ? note.text : "");
  const [email, setEmail] = useState("singh.captain107@gmail.com");

  const handleSave = async () => {
    // Update note text
    onEdit(note, noteText);

    // Fetch ARN
    const response = await axios.get(
      "https://aep40x3ihl.execute-api.us-east-1.amazonaws.com/prod/"
    );

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
        const updateResponse = await axios.post(
          "https://qqaeoe85z8.execute-api.us-east-1.amazonaws.com/prod/",
          newNote
        );

        if (updateResponse.status === 200) {
          console.log("Note successfully updated");
        }

        // Subscribe note
        const subscribeResponse = await axios.post(
          "https://szs5bn2441.execute-api.us-east-1.amazonaws.com/prod/",
          {
            topicArn: noteWithArn.topicArn,
            message:
              "This is an update onto your subscribed notes : \n" + noteText,
            subject: "Update on your subscribed notes : " + note.title,
            isSubscribe: false,
            email: email,
          }
        );

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

  // ...

  const subscribeNote = async (title, text, arn, isSubscribe) => {
    try {
      const response = await axios.post(
        "https://szs5bn2441.execute-api.us-east-1.amazonaws.com/prod/",
        {
          topicArn: arn,
          message: text,
          subject: title,
          isSubscribe: isSubscribe,
          email: email,
        }
      );
      if (response.status === 200) {
        console.log("Note subscription successful");
      }
    } catch (error) {
      console.log("Failed to subscribe:", error);
    }
  };

  // Function to update the note in the backend
  const updateNote = async (id, text, title) => {
    try {
      const newNote = {
        title: title,
        text: text,
        id: id,
        isEditing: false,
      };
      const response = await axios.post(
        "https://qqaeoe85z8.execute-api.us-east-1.amazonaws.com/prod/",
        newNote
      );
      if (response.status === 200) {
        console.log("Note successfully updated");
      }
    } catch (error) {
      console.log("Failed to update note:", error);
    }
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
