import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Textarea,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

function NotesEditing({ notes, updateNote, deleteNote }) {
  const [editIndex, setEditIndex] = useState(-1);
  const [editedText, setEditedText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNote, setSelectedNote] = useState(null);

  const startEditing = (index, text) => {
    setEditIndex(index);
    setEditedText(text);
  };

  const saveNoteChanges = (index) => {
    updateNote(index, editedText);
    setEditIndex(-1);
    setEditedText("");
  };

  const handleNoteClick = (note) => {
    setSelectedNote(note);
    onOpen();
  };

  const handleNoteDelete = (note) => {
    deleteNote(note);
    onClose();
  };

  return (
    <>
      {notes.map((note, index) => (
        <React.Fragment key={index}>
          {selectedNote === note ? (
            <Box borderWidth="1px" borderRadius="md" p={4} position="relative">
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {note.timestamp}
              </Text>
              <Text>{note.text}</Text>
              {editIndex === index ? (
                <>
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                  />
                  <Button
                    colorScheme="teal"
                    size="sm"
                    onClick={() => saveNoteChanges(index)}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    colorScheme="blue"
                    size="xs"
                    position="absolute"
                    top={2}
                    right={30}
                    onClick={() => startEditing(index, note.text)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    icon={<DeleteIcon />}
                    colorScheme="red"
                    size="xs"
                    position="absolute"
                    top={2}
                    right={2}
                    onClick={() => handleNoteDelete(note)}
                    aria-label="Delete Note"
                  />
                </>
              )}
            </Box>
          ) : (
            <Box
              borderWidth="1px"
              borderRadius="md"
              p={4}
              position="relative"
              onClick={() => handleNoteClick(note)}
              cursor="pointer"
            >
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                {note.timestamp}
              </Text>
              <Text>{note.text}</Text>
            </Box>
          )}
        </React.Fragment>
      ))}
      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedNote.timestamp}</ModalHeader>
            <ModalBody>
              <Text>{selectedNote.text}</Text>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default NotesEditing;
