import React, { useContext, useEffect, useState } from 'react';
import './Styles.css';
import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button
  } from "@fluentui/react-components";
import pokeballIcon from '../../utils/pokeball-sprite.png'
import { capitalize } from '../PokemonCard/PokemonCard';
import { AppContext } from '../../context/app-context';
import { useDispatch } from 'react-redux';
import { capturePokemon } from '../../redux/slices/pokedex-slice';
import {v4 as uuid} from 'uuid';

interface DialogProps {
  pokemonName: string;
  pokemonSprite: string | undefined;
  pokemonType: string | undefined;
}

const CaptureDialog: React.FC<DialogProps> = ({ pokemonName, pokemonSprite, pokemonType }) => {

  const [inputText, setInputText] = useState<string>("");
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const {notify} = useContext(AppContext);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if(timer) {
      clearTimeout(timer);
    }

    const newTimer = setTimeout(() => {
      if((inputText.length > 0 && inputText.length < 3) || inputText.length > 50) {
        setIsInvalid(true);
      } 
      else {
        setIsInvalid(false)
      }
    }, 1000)

    setTimer(newTimer);
  }, [inputText])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let finalName = inputText;

    if(finalName === undefined || finalName === '') {
      finalName = pokemonName
    }

    if(finalName.length < 3 || finalName.length > 50) {
        notify("Error", capitalize(finalName) + " doesn't respect the name size restriction", "error");

    } 
    else {
      dispatch(capturePokemon({
        id: uuid(),
        name: finalName,
        originalName: pokemonName,
        type: pokemonType!
      }));
      notify("Captured!", capitalize(finalName) + " was captured", "success");
      setIsOpen(false);
    }
  };


  return (
    <Dialog open={isOpen}>

      <DialogTrigger disableButtonEnhancement>
        <img className='pokeballImg' onClick={() => setIsOpen(true)} src={pokeballIcon} alt='pokeball'/>
      </DialogTrigger>

      <DialogSurface>
        <form onSubmit={handleSubmit}>

            <DialogBody>

                <DialogTitle>Pokémon Capture</DialogTitle>
        

                <DialogContent className='content'>
                    <div className='pokemon-infos'>
                        <img src={pokemonSprite} alt={pokemonName}/>

                        <div className='pokemon-text'>
                            <p className='bold'>Name:</p>
                            <p>{capitalize(pokemonName)}</p>
                        </div>

                        <div className='pokemon-text'>
                            <p className='bold'>Type:</p>
                            <p>{pokemonType}</p>
                        </div>

                    </div>

                    <div className='form'>
                        <label className='bold'>Wanna rename?</label>
                        <input className='inputForm' onChange={(e) => setInputText(e.target.value)} type="text" placeholder={capitalize(pokemonName)} />
                    </div> 

                    {isInvalid ? 
                      (<p className='advertise'>*The length of the renamed name must be between 3 and 50</p>)
                       :
                       (<p className='advertise'></p>)}
                </DialogContent>

                <DialogActions>
                      <Button appearance="secondary" onClick={() => setIsOpen(false)}>Close</Button>
                      <Button appearance="primary" disabled={isInvalid} type='submit'>Capture</Button>
                </DialogActions>


            </DialogBody>
        </form>

      </DialogSurface>
    </Dialog>
  );
};

export default CaptureDialog;
