import { useGetPokemonInfosQuery } from '../../redux/slices/pokemon-api-slice';
import './Styles.css';
import { Card, CardHeader } from "@fluentui/react-components";
import CaptureDialog from '../CaptureDialog/CaptureDialog2';
import React from 'react';
import TradePokemon from '../TradePokemon/TradePokemon';

interface PokemonCardInput{
    name: string,
    originalName: string,
    isPokedex: boolean,
    id: string | null,
}

export function capitalize(name: string) {
    if(name === '' || name === undefined) {
        return ''
    }
    return name[0].toUpperCase() + name.slice(1);
}

const PokemonCard: React.FC<PokemonCardInput> = ({name, originalName, isPokedex, id}) => {

    const { data } = useGetPokemonInfosQuery(originalName);

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
                            pokemonType={data?.types[0].type.name}/>
                    </div>) : 
                    (<div>
                        <TradePokemon 
                            pokemon={{
                                name: name,
                                originalName: originalName,
                                id: id!,
                                type: data?.types[0].type.name || "",
                            }}
                        />
                    </div>)}
                </div>
            </div>
        </Card>
    )
};
export default PokemonCard