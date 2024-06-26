import './Styles.css';
import LateralMenu from '../components/LateralMenu/LateralMenu';
import Pokemons from './Pokemons/Pokemons';
import Pokedex from './Pokedex/Pokedex';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { upadtePokedex } from '../redux/slices/pokedex-slice';
import { useAppSelector } from '../redux/hooks';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Divider } from '@fluentui/react-components';
import { changeLoggedUser} from '../redux/slices/users-slice';


function App() {

    const captured = useAppSelector((state) => state.pokedex.captured);
    const loggedUser = useAppSelector((state) => state.user.loggedUser);
    const dispatch = useDispatch();

    useEffect(() => {
        window.electronAPI.receiveInitialUser((user) => {
            if (!user || typeof user.id !== "string" || typeof user.name !== "string") {
                throw new Error("Invalid initial user format");
            }
            dispatch(changeLoggedUser(user));
        });    
    }, [dispatch])

    useEffect(() => {
        if(loggedUser !== undefined && loggedUser.name !== undefined && loggedUser.name !== "") {
            window.electronAPI.getUserPokedex(loggedUser)
            .then(pokedex => {
                dispatch(upadtePokedex(pokedex));
            })
        }
    }, [dispatch, loggedUser])

    useEffect(() => {
        window.electronAPI.setPokedex(captured, loggedUser);
    }, [captured, loggedUser])

  return (
    <Router>
        <div className="App">
            <div className='lateral-Menu'>
                <LateralMenu/>    
            </div>
            <Divider vertical style={{height: "65vh", paddingTop: '1rem'}}></Divider>
            <div className='pages'>
                <Routes>
                    <Route path='/' element={<Pokemons/>}/>
                    <Route path='/pokedex' element={<Pokedex/>}/>
                </Routes>
            </div>
        </div>
    </Router>

  );
}

export default App;
