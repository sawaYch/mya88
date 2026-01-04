import { Card, Input, Image, Button, Spinner } from "@heroui/react";
import { useState } from "react";
import { motion } from "framer-motion";
import { EyeFilledIcon, EyeSlashFilledIcon } from ".";

interface AuthFormProps {
  onSubmit: (passphrase: string) => void;
}

export const AuthForm = ({ onSubmit }: AuthFormProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [passphrase, setPassphrase] = useState<string>("");
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex h-[70vh] justify-center items-center">
      <motion.div
        className="flex h-fit justify-center items-center backdrop-blur-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className="border-none bg-default-100/50 max-w-[610px] p-4 flex items-center flex-col gap-4"
          shadow="lg"
        >
          <Image
            src={"/greeting.webp"}
            alt="banner"
            radius="full"
            className="object-cover object-center pointer-events-none select-none ring-2 ring-offset-2 ring-offset-default-100 ring-pink-500"
          />
          <div className="text-sm uppercase">㊙️Secret Code㊙️</div>
          <div className="flex gap-2">
            <Input
              value={passphrase}
              onValueChange={setPassphrase}
              radius="full"
              classNames={{
                inputWrapper: "border-none focus-within:border-none focus-within:ring-0 shadow-none",
                input: "focus:outline-none",
              }}
              endContent={
                <button
                  className="outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  ) : (
                    <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
            />
            <Button
              isIconOnly
              aria-label="passphrase"
              radius="full"
              className="bg-pink-500/80"
              onPress={async () => {
                setIsLoading(true);
                await onSubmit(passphrase);
                setIsLoading(false);
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Spinner color="default" size="sm" />
              ) : (
                <Image
                  src={"/key.svg"}
                  alt="key-icon"
                  radius="full"
                  height={28}
                  width={28}
                  className="object-cover object-center pointer-events-none select-none"
                />
              )}
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
