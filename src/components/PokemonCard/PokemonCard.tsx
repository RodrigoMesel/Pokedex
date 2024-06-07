import { useGetPokemonInfosQuery } from '../../redux/slices/pokemon-api-slice';
import './Styles.css';
import { Card, CardHeader } from "@fluentui/react-components";
import { useDispatch } from 'react-redux';
import { capturePokemon } from '../../redux/slices/pokedex-slice';
import CaptureDialog from '../CaptureDialog/CaptureDialog2';
import React, { useState } from 'react';
import ToastComponent from '../Toast/Toast';


interface PokemonCardInput{
    name: string,
    originalName: string,
    isPokedex: boolean,
}

export function capitalize(name: string) {
    if(name === '' || name === undefined) {
        return ''
    }
    return name[0].toUpperCase() + name.slice(1);
}

const PokemonCard: React.FC<PokemonCardInput> = ({name, originalName, isPokedex}) => {

    const { data } = useGetPokemonInfosQuery(originalName);

    const [notify, setNotify] = useState<boolean>(false);
    const [intent, setIntent] = useState<string>("");
    const [newName, setNewName] = useState<string>(name);
    const [isOpenDialog, setIsOpenDiaolg] = useState<boolean>(false);

    const dispatch = useDispatch();

    const handleSubmit = (newName: string, success: boolean) => {
        setNewName(newName)
    
        if(!success) {
            setIntent("error");
            setNotify(true);
        }
        else {
            dispatch(capturePokemon({
                name: newName,
                originalName: originalName
            }));
            setIntent("success")
            setNotify(true);
        }
    }

    return(
        <Card className='card'>
            <CardHeader
                image={<img className='avatar' src={data?.sprites.front_default} alt={originalName}/>}
                header={<h4 className='card-name'>{capitalize(name)}</h4>}
                description={<p className='card-pokemon-type'>Type: {data?.types[0].type.name}</p>}
            />

            <div className='card-body'>
                <div className='card-body-infos'>
                    <div className='card-body-text'>
                        <p className='bold'>Height:</p>
                        <p>{data?.height}m</p>
                    </div>
                    <div className='card-body-text'>
                        <p className='bold'>Weight:</p>
                        <p>{data?.weight}kg</p>

                    </div>

                </div>

                <div className='pokeball-container'>
                    {!isPokedex ? (
                    <div>
                        <CaptureDialog  
                            pokemonName={originalName}
                            pokemonSprite={data?.sprites.front_default}
                            pokemonType={data?.types[0].type.name}
                            onSubmit={handleSubmit}
                            isOpen={isOpenDialog}
                            setIsOpen={setIsOpenDiaolg}/>
                    </div>) : (<></>)}
                </div>
            </div>
            <ToastComponent name={newName} intent={intent} activate={notify} setActivate={setNotify}/>
        </Card>
    )
};
export default PokemonCard