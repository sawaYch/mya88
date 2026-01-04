import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleStopProcess: () => void;
}

export const ConfirmModal = ({
  handleStopProcess,
  isOpen,
  onClose,
}: ConfirmModalProps) => {
  return (
    <Modal size="md" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              ⚠️ Confirmation
            </ModalHeader>
            <ModalBody>
              <p>Are you sure to stop current process?</p>
            </ModalBody>
            <ModalFooter>
              <Button color="default" onPress={onClose}>
                Close
              </Button>
              <Button color="danger" onPress={handleStopProcess}>
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
