import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Combobox,
    Option,
  } from "@fluentui/react-components";
import { useContext, useState } from "react";
import { PokemonType, upadtePokedex } from "../../redux/slices/pokedex-slice";
import {ArrowSwapRegular} from "@fluentui/react-icons"
import { useAppSelector } from "../../redux/hooks";
import { capitalize } from "../PokemonCard/PokemonCard";
import { useDispatch } from "react-redux";
import { user } from "../../redux/slices/users-slice";
import { AppContext } from "../../context/app-context";

interface TradePokemonProps {
    pokemon: PokemonType,
}

const TradePokemon = ({pokemon} : TradePokemonProps) => {

    const [isOpen, setIsOpen] = useState(false);
    const users = useAppSelector((state) => state.user.users);
    const loggedUser = useAppSelector((state) => state.user.loggedUser);
    const [selectedUser, setSelectedUser] = useState<user|null>(null);

    const {notify} = useContext(AppContext);
  
    const dispatch = useDispatch();

    const handleClick = () => {
        if(selectedUser !== null) {
            window.electronAPI.tradePokemons(pokemon, loggedUser, selectedUser)
                .then(pokedex => {
                        notify("Traded!", capitalize(pokemon.name) + " was traded to " + selectedUser.name, "success");
                        dispatch(upadtePokedex(pokedex))
                        setSelectedUser(null);
                        setIsOpen(false);
                    }
                )
        } 
        else {
            notify("Error", "Select an user to trade the pokemon", "error");
        }
    }

    return(
        <Dialog open={isOpen}>

            <DialogTrigger disableButtonEnhancement>
                <ArrowSwapRegular data-testid={'tradeDialog'} fontSize={"22px"} onClick={() => setIsOpen(true)}/>
            </DialogTrigger>

            <DialogSurface>

                <DialogBody>

                    <DialogTitle>Pokémon Transfer</DialogTitle>
            

                    <DialogContent className='content' style={{margin: '2rem', gap: '1rem'}}>
                        Do you want to transfer {capitalize(pokemon.name)} to who?

                        <Combobox>
                            {users.filter(c => c.id !== loggedUser.id).map((user) => (
                                <Option key={user.id} text={user.name} onClick={() => setSelectedUser(user)}>{user.name}</Option>
                            ))}
                        </Combobox>     
                    </DialogContent>

                    <DialogActions>
                            <Button appearance="secondary" onClick={() => setIsOpen(false)}>Cancel</Button>
                            <Button appearance="primary" onClick={handleClick}>Trade</Button>
                    </DialogActions>


                </DialogBody>

            </DialogSurface>

        </Dialog>
  )
}
export default TradePokemon