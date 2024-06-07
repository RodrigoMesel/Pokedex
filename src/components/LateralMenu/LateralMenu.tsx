import { useNavigate } from 'react-router-dom'
import { Tab, TabList } from '@fluentui/react-components'
import AccountChanger from '../AccountChanger/AccountChanger';
import './LateralMenu.css'

const LateralMenu = () => {
  
  let navigate = useNavigate();


  return(
  <div className='menu'>

    <div className='top-menu'>
      <AccountChanger/>
    </div>

    <TabList className='tablist' size='large' style={{flexDirection: 'column'}} defaultSelectedValue='pokemons'>

      <Tab value="pokemons" as='button' onClick={() => navigate('/')} content="Pokémons"/>

      <Tab value='pokedex' as='button' onClick={() => navigate('/pokedex')} content={"Pokédex"}/>

    </TabList>
  </div>
  )
}
export default LateralMenu