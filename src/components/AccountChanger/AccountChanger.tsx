import { Avatar, Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from '@fluentui/react-components'
import { useAppSelector } from '../../redux/hooks';
import { useDispatch } from 'react-redux';
import { changeLoggedUser, user } from '../../redux/slices/users-slice';

const AccountChanger = () => {

  const users = useAppSelector((state) => state.user.users);
  const loggedUser = useAppSelector((state) => state.user.loggedUser);
  const dispatch = useDispatch();


  function handleClick(user: user) {
    dispatch(changeLoggedUser(user));
  }
  
  return(
  <Menu>

    <MenuTrigger disableButtonEnhancement>
      <Avatar name={loggedUser.name} size={40}/>
    </MenuTrigger>

    <MenuPopover>
      <MenuList>
        {users.map((user, index) => (
          <MenuItem onClick={() => handleClick(user)} key={index}>{user.name}</MenuItem>
        ))}
      </MenuList>
    </MenuPopover>
    
  </Menu>
  )
}
export default AccountChanger