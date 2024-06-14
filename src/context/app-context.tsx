import { Toast, ToastBody, ToastIntent, ToastTitle, Toaster, useId, useToastController } from "@fluentui/react-components";
import { ReactNode, createContext, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';

interface AppContextType {
    filterName: string,
    setFilterName: React.Dispatch<React.SetStateAction<string>>;
    filterTypes: string[],
    setFilterTypes: React.Dispatch<React.SetStateAction<string[]>>;
    isOptionsOpen: boolean,
    setIsOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    ascendingOrder: boolean,
    setAscendingOrder: React.Dispatch<React.SetStateAction<boolean>>;
    notify: (title: string, body: string, intent: ToastIntent) => void;
}

interface AppContextProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppContextType>({} as AppContextType)  

export const AppContextProvider: React.FC<AppContextProviderProps> = ({children}) => {

    const [filterName, setFilterName] = useState<string>("");
    const [filterTypes, setFilterTypes] = useState<string[]>([]);
    const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
    const [ascendingOrder, setAscendingOrder] = useState(true);

    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);
    
    const notify = (title: string, body: string, intent: ToastIntent) => 
        dispatchToast(
          <Toast>
            <ToastTitle>{title}</ToastTitle>
            <ToastBody>{body}</ToastBody>
          </Toast>,
          { intent: intent }
        );

    return (
        <AppContext.Provider value={{ filterName, setFilterName, filterTypes, setFilterTypes, isOptionsOpen, setIsOptionsOpen, ascendingOrder, setAscendingOrder, notify }}>
            {children}
            <Toaster position="top-end" toasterId={toasterId} timeout={2000} />
        </AppContext.Provider>
      );
}

