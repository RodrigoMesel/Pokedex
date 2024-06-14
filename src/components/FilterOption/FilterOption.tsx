import { Tree, TreeItem, TreeItemLayout, Option, Button, Combobox } from "@fluentui/react-components";
import { FilterRegular} from "@fluentui/react-icons";
import { useCallback, useContext, useMemo, useState } from "react";
import { PokemonType } from "../../redux/slices/pokedex-slice";
import { AppContext } from "../../context/app-context";

interface FilterOptionProps{
    pokedex: PokemonType[]
}

const FilterOption = ({pokedex}: FilterOptionProps) => {

    const {filterTypes, setFilterTypes} = useContext(AppContext);

    const options = Array.from(new Set (pokedex.map(c => c.type))).sort();

    const [open, setIsOpen] = useState(false);

    const handleClick = useCallback((option: string) => {
        setFilterTypes(prev => {
            if(prev.includes(option)){
                return prev.filter(item => item !== option);
            }
            return [...prev, option]
        })
    }, [setFilterTypes])

    const renderedOptions = useMemo(() => options.map(option => (
        <Option key={option} text={option} onClick={() => handleClick(option)}>
            {option}
        </Option>
    )), [options, handleClick]);
    

  return(
    <Tree aria-label="Default">
        <TreeItem itemType="branch">
            <TreeItemLayout>
                Filter <FilterRegular />
            </TreeItemLayout>
            <Tree>
                <TreeItem itemType="leaf">
                    <TreeItemLayout style={{padding: 0}}>

                        <Combobox 
                            onClick={() => setIsOpen(!open)}
                            open={open}
                            multiselect={true}
                            selectedOptions={filterTypes}
                            placeholder="Select some types">
                                {renderedOptions}
                        </Combobox>

                    </TreeItemLayout>
                </TreeItem>

                <TreeItem itemType="leaf">
                    <TreeItemLayout style={{marginTop: '1rem', marginLeft: '2rem'}}>

                        <Button onClick={() => setFilterTypes([])}>Clear filters</Button>

                    </TreeItemLayout>
                </TreeItem>
            </Tree>
        </TreeItem>
  </Tree>
  )
}
export default FilterOption