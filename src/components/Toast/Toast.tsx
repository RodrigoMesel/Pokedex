import React, { useEffect } from 'react';
import { capitalize } from '../PokemonCard/PokemonCard';
import {
    useId,
    Toaster,
    useToastController,
    Toast,
    ToastTitle,
    ToastBody,
  } from "@fluentui/react-components";

interface ToastComponentProps{
    name: string,
    intent: string,
    activate: boolean,
    setActivate: React.Dispatch<React.SetStateAction<boolean>>
}

const ToastComponent: React.FC<ToastComponentProps> = ({name, intent, activate, setActivate}) => {
      
    const toasterId = useId("toaster");
    const { dispatchToast } = useToastController(toasterId);

    const notifySuccess = () => 
      dispatchToast(
        <Toast>
          <ToastTitle>Captured!</ToastTitle>
          <ToastBody>{capitalize(name)} was added to the pokedex</ToastBody>
        </Toast>,
        { intent: "success" }
      );

    const notifyError = () => 
        dispatchToast(
            <Toast>
                <ToastTitle>Error</ToastTitle>
                <ToastBody>{capitalize(name)} doesn't respect the name size restriction </ToastBody>
            </Toast>,
            { intent: "error" }
    )

    useEffect(() => {
      if(activate) {
        if(intent === "error") {
          notifyError();
        } else if (intent === "success") {
          notifySuccess();
        }
        setActivate(false);
      }

    }, [activate])
        

    return(
        <>
            <Toaster position="top-end" toasterId={toasterId} timeout={2000} />
        </>
    )
};

export default ToastComponent
