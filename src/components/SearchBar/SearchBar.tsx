import { InputOnChangeData, SearchBox, SearchBoxChangeEvent } from '@fluentui/react-components'

interface SearchBarProps {
    filterName: string;
    setFilterName: React.Dispatch<React.SetStateAction<string>>
}

const SearchBar = ({filterName, setFilterName}: SearchBarProps) => {
  
    const handleFilterNameChange: (ev: SearchBoxChangeEvent, data: InputOnChangeData) => void = (_, data) => {
        setFilterName(data.value);
      }

  return(
    <div>
        <SearchBox value={filterName} onChange={handleFilterNameChange}/>
    </div>
  )
}
export default SearchBar