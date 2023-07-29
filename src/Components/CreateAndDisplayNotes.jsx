import React, { useState } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  SimpleGrid,
  Heading,
  IconButton,
  Badge,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import NotesEditing from "../Components/NotesEditing ";
import axios from "axios";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import {
  REACT_APP_API_GETDATA,
  REACT_APP_API_PUTDATA,
  REACT_APP_API_SNS,
  REACT_APP_API_TEXT,
} from "../util/URLs";

function CreateAndDisplayNotes() {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [noteHeading, setNoteHeading] = useState("");
  const [file, setFile] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [subscribedNotes, setSubscribedNotes] = useState([]);
  const [email, setEmail] = useState("");

  const onEditNote = (note, newText) => {
    const updatedNotes = notes.map((n) =>
      n === note ? { ...n, text: newText } : n
    );
    setNotes(updatedNotes);
  };

  const {
    isOpen: isSubscribeModalOpen,
    onOpen: onSubscribeModalOpen,
    onClose: onSubscribeModalClose,
  } = useDisclosure();

  const toggleSubscription = (note) => {
    setSelectedNote(note);
    onSubscribeModalOpen();
  };

  const {
    isOpen: isAddNoteOpen,
    onOpen: onAddNoteOpen,
    onClose: onAddNoteClose,
  } = useDisclosure();

  const {
    isOpen: isUploadNoteOpen,
    onOpen: onUploadNoteOpen,
    onClose: onUploadNoteClose,
  } = useDisclosure();

  const handleSubscription = async () => {
    // First, fetch all the notes
    try {
      const response = await axios.get(REACT_APP_API_GETDATA);
      if (response.status === 200) {
        // If the request is successful, find the note by id
        const allNotes = response.data;
        const noteWithArn = allNotes.find(
          (note) => note.id === selectedNote.id
        );

        if (noteWithArn) {
          console.log(noteWithArn.topicArn);
          try {
            const subscribeResponse = await axios.post(REACT_APP_API_SNS, {
              topicArn: noteWithArn.topicArn,
              message: selectedNote.text,
              subject: selectedNote.title,
              isSubscribe: true,
              email: email,
            });
            if (subscribeResponse.status === 200) {
              // If the subscription is successful, add the note to the list of subscribed notes
              setSubscribedNotes([...subscribedNotes, selectedNote]);
              setEmail("");
              onSubscribeModalClose();
            }
          } catch (error) {
            console.log("Failed to subscribe:", error);
          }
        } else {
          console.log("Note not found:", selectedNote.id);
        }
      }
    } catch (error) {
      console.log("Failed to fetch notes:", error);
    }
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  const {
    isOpen: isViewNoteOpen,
    onOpen: onViewNoteOpen,
    onClose: onViewNoteClose,
  } = useDisclosure();

  const addNote = async () => {
    if (noteText.trim() !== "" && noteHeading.trim() !== "") {
      const newNote = {
        title: noteHeading,
        text: noteText,
        id: `${Date.now()}`,
        isEditing: false,
      };
      try {
        const response = await axios.post(REACT_APP_API_PUTDATA, newNote);
        if (response.status === 200) {
          setNoteText("");
          setNoteHeading("");
          onAddNoteClose();
          fetchNotes();
        }
      } catch (error) {
        console.log("Failed to add note:", error);
      }
    }
  };

  const uploadNote = async () => {
    console.log(file);
    if (file) {
      console.log("aaya");
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");
        const response = await axios.post(REACT_APP_API_TEXT, {
          image: base64String,
        });
        if (response.data) {
          console.log("Data" + response.data);
          const newNote = {
            title: "Hand written note",
            text: response.data,
            id: `${Date.now()}`,
            isEditing: false,
          };
          try {
            const addNoteResponse = await axios.post(
              REACT_APP_API_PUTDATA,
              newNote
            );
            if (addNoteResponse.status === 200) {
              fetchNotes();
              setNoteText("");
              setNoteHeading("");
              setFile(null);
              onUploadNoteClose();
            }
          } catch (error) {
            console.log("Failed to upload note:", error);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const fetchNotes = async () => {
    try {
      const response = await axios.get(REACT_APP_API_GETDATA);
      if (response.status === 200) {
        //console.log(response.data);
        setNotes(response.data);
      }
    } catch (error) {
      console.log("Failed to fetch notes:", error);
    }
  };

  // Call fetchNotes in a useEffect hook when the component mounts
  React.useEffect(() => {
    fetchNotes();
  }, []);

  React.useEffect(() => {
    fetchNotes();
  }, []);

  const viewNote = (note) => {
    setSelectedNote(note);
    onViewNoteOpen();
  };

  const deleteNote = () => {
    setNotes(notes.filter((note) => note !== selectedNote));
    setSelectedNote(null);
    onViewNoteClose();
  };

  const uploadImage = async (event) => {
    // const file = event.target.files[0];
    // const base64 = await getBase64(file);
  };
  return (
    <Box py={8} mx="auto" maxWidth="90%">
      <Text fontSize="3xl" fontWeight="bold" mb={4}>
        Chrono Notes
      </Text>
      <Button colorScheme="teal" onClick={onAddNoteOpen} mr={3}>
        Add Note
      </Button>
      <Button colorScheme="teal" onClick={onUploadNoteOpen}>
        Upload Handwritten Note
      </Button>

      {/* Modal for adding a note */}
      <Modal isOpen={isAddNoteOpen} onClose={onAddNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
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
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={addNote}>
              Save
            </Button>
            <Button onClick={onAddNoteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Modal for uploading a handwritten note */}
      <Modal isOpen={isUploadNoteOpen} onClose={onUploadNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Handwritten Note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".jpg,.png"
            />
          </ModalBody>
          <ModalFooter>
            {/* <Button colorScheme="blue" mr={3} onClick={addNote}>
              Upload
            </Button>
             */}

            <Button colorScheme="blue" mr={3} onClick={uploadNote}>
              Upload
            </Button>
            <Button onClick={onUploadNoteClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <SimpleGrid columns={3} spacing={10} mt={5}>
        {notes.map((note, index) => (
          <Box
            key={index}
            p="6"
            rounded="md"
            borderWidth={1}
            onClick={() => viewNote(note)}
            cursor="pointer"
            position="relative" //add this line
          >
            <Button
              size="xs"
              colorScheme={subscribedNotes.includes(note) ? "green" : "gray"}
              onClick={(e) => {
                e.stopPropagation();
                toggleSubscription(note);
              }}
            >
              {subscribedNotes.includes(note) ? "Subscribed" : "Subscribe"}
            </Button>
            <Heading size="md">{note.title}</Heading>
            <Text mt={2} color="gray.600">
              {note.timestamp}
            </Text>
            <Tooltip
              label="Clicking subscribe icon will subscribe your email to the note. Any updates to this note will be sent to you via email."
              placement="top"
              bg="blue.600"
            >
              <IconButton
                icon={<InfoOutlineIcon />}
                variant="ghost"
                aria-label="Subscribe Info"
                position="absolute"
                top={2}
                right={2}
                onClick={(e) => {
                  e.stopPropagation(); // prevents the note from being selected when the info icon is clicked
                }}
              />
            </Tooltip>
          </Box>
        ))}
      </SimpleGrid>

      <Modal isOpen={isViewNoteOpen} onClose={onViewNoteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedNote && selectedNote.title}
            <IconButton
              icon={<EditIcon />}
              colorScheme="yellow"
              variant="ghost"
              float="right"
              onClick={() => setEditingNote(selectedNote)}
              mr={2}
            />
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              variant="ghost"
              float="right"
              onClick={deleteNote}
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>{selectedNote && selectedNote.text}</ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSubscribeModalOpen} onClose={onSubscribeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Subscribe to this note</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubscription}>
              Subscribe
            </Button>
            <Button onClick={onSubscribeModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <NotesEditing
        note={editingNote}
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        onEdit={onEditNote}
      />
    </Box>
  );
}

export default CreateAndDisplayNotes;
