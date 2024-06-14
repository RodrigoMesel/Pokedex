import { Button, Dialog, DialogActions, DialogBody, DialogContent, DialogSurface, DialogTitle, DialogTrigger } from "@fluentui/react-components";
import { useState } from 'react';
import { useDispatch } from "react-redux";
import { resetPokedex } from "../../redux/slices/pokedex-slice";


const ResetPokedex = () => {

    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();

    const handleClick = () => {
        dispatch(resetPokedex());
        setIsOpen(false);
    }

    return(
        <Dialog open={isOpen}>
            <DialogTrigger>
                <Button onClick={() => setIsOpen(true)}>Reset pokedex</Button>
            </DialogTrigger>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Reset Pokedex</DialogTitle>
                    <DialogContent>
                        Are you sure you want to reset your Pokedex? 
                        This action cannot be undone and all your saved 
                        data will be permanently erased. Please confirm 
                        if you wish to proceed.
                    </DialogContent>
                    <DialogActions>
                    <DialogTrigger>
                        <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                    </DialogTrigger>
                    <Button appearance="primary" onClick={handleClick} >Confirm</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    )
};
export default ResetPokedex