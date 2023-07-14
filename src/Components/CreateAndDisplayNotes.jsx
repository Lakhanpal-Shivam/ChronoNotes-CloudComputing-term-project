import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  Grid,
  useDisclosure,
} from "@chakra-ui/react";
import NotesEditing from "../Components/NotesEditing ";

function CreateAndDisplayNotes() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteHeading, setNoteHeading] = useState("");
  const [file, setFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState("addNote");

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNote, setSelectedNote] = useState(null);

  const addNote = () => {
    if (
      noteText.trim() !== "" &&
      noteHeading.trim() !== "" &&
      ((selectedOption === "addNote" && file) ||
        selectedOption === "uploadNote")
    ) {
      const timestamp = new Date().toLocaleString();
      const newNote = {
        timestamp,
        heading: noteHeading,
        text: noteText,
        file: selectedOption === "addNote" ? file : null,
      };
      setNotes([...notes, newNote]);
      setNoteText("");
      setNoteHeading("");
      setFile(null);
    }
  };

  const deleteNote = (index) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };

  const handleNoteClick = (index) => {
    setSelectedNote(notes[index]);
    onOpen();
  };

  const updateNote = (index, newText) => {
    const updatedNotes = [...notes];
    updatedNotes[index].text = newText;
    setNotes(updatedNotes);
  };

  const handleMenuItemClick = (action) => {
    // Handle menu item click based on the action
    console.log("Clicked:", action);
  };

  return (
    <Box py={8} mx="auto" maxWidth="90%">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        Chrono Notes
      </Text>
      <VStack spacing={4} align="stretch">
        {selectedOption === "addNote" ? (
          <>
            <Input
              placeholder="Enter your note heading"
              value={noteHeading}
              onChange={(e) => setNoteHeading(e.target.value)}
            />
            <Input
              placeholder="Enter your note"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button colorScheme="teal" onClick={addNote}>
              Add Note
            </Button>
          </>
        ) : (
          <>
            <Input
              colorScheme="teal"
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".jpg,.png"
            />
            <Button colorScheme="teal" onClick={addNote}>
              Upload Handwritten Note
            </Button>
          </>
        )}
        <Button
          colorScheme="teal"
          onClick={() =>
            setSelectedOption(
              selectedOption === "addNote" ? "uploadNote" : "addNote"
            )
          }
        >
          {selectedOption === "addNote"
            ? "Upload Handwritten Note"
            : "Add Note"}
        </Button>
      </VStack>
      <Grid templateColumns="repeat(auto-fill, minmax(300px, 1fr))" gap={4}>
        {notes.map((note, index) => (
          <Box
            key={index}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            cursor="pointer"
            onClick={() => handleNoteClick(index)}
          >
            <Text fontSize="lg" fontWeight="bold" mb={2}>
              {note.heading}
            </Text>
            <Text>{note.timestamp}</Text>
            {note.file && <Text>{note.file.name}</Text>}
            {isOpen && selectedNote === note && (
              <NotesEditing
                notes={notes}
                updateNote={updateNote}
                deleteNote={deleteNote}
                onClose={onClose}
              />
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}

export default CreateAndDisplayNotes;
