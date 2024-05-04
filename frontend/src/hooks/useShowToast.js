import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

const useShowToast = () => {
    const toast = useToast();
    const showToast = useCallback((title, status) => {
        toast({
            title,
            status,
            isClosable: true,
            duration: 3000,
        });
    } ,[toast])
    return showToast;
};

export default useShowToast;
