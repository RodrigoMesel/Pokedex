import { Checkbox, Tree, TreeItem, TreeItemLayout } from "@fluentui/react-components";
import { ArrowSortRegular} from "@fluentui/react-icons";
import { useContext } from "react";
import { AppContext } from "../../context/app-context";


const SortOption = () => {

    const {ascendingOrder, setAscendingOrder} = useContext(AppContext);
  
  return(
    <Tree aria-label="Default">
        <TreeItem itemType="branch">
            <TreeItemLayout>
                Sort <ArrowSortRegular />
            </TreeItemLayout>
            <Tree>
                <TreeItem itemType="leaf" onClick={() => setAscendingOrder(true)}>
                    <TreeItemLayout style={{padding: 0}}>
                        <Checkbox checked={ascendingOrder}/>
                        A to Z
                    </TreeItemLayout>
                </TreeItem>
                <TreeItem itemType="leaf" onClick={() => setAscendingOrder(false)}>
                    <TreeItemLayout style={{padding: 0}}>
                        <Checkbox checked={!ascendingOrder}/>
                        Z to A
                    </TreeItemLayout>
                </TreeItem>

            </Tree>
        </TreeItem>
  </Tree>
  )
}
export default SortOption