import { Menu, MenuItem, MenuList, MenuPopover, MenuTrigger } from "@fluentui/react-components"
import { OptionsFilled } from "@fluentui/react-icons";
import SortOption from "../SortOption/SortOption";
import FilterOption from "../FilterOption/FilterOption";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";
import { PokemonType } from "../../redux/slices/pokedex-slice";

interface PokedexOptionsProps {
    pokedex: PokemonType[]
}


const PokedexOptions = ({pokedex}: PokedexOptionsProps) => {

    const {isOptionsOpen, setIsOptionsOpen} = useContext(AppContext);
  
    const handleMenuOpenChange = (event: { open: boolean }) => {
        setIsOptionsOpen(event.open);
    };

  return(
    <Menu open={isOptionsOpen} onOpenChange={() => handleMenuOpenChange}>
        <MenuTrigger>
            <OptionsFilled data-testid={'optionsMenu'} role={'button'} onClick={() => setIsOptionsOpen(!isOptionsOpen)} fontSize={"28px"} />
        </MenuTrigger>

        <MenuPopover>
            <MenuList>
                <MenuItem>
                    <SortOption/>
                </MenuItem>
                <MenuItem>
                    <FilterOption pokedex={pokedex}/>
                </MenuItem>
            </MenuList>
        </MenuPopover>
    </Menu>
  )
}
export default PokedexOptions