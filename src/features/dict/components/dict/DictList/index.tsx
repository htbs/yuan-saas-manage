import {
  baseColumns,
  DictFilterListParams,
  useDictStore,
  useDictList,
  searchFields,
} from "@/src/features/dict";

import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import GenericFilterableList from "@/src/components/GenericFilterableList/GenericFilterableList";
import { DictInfo } from "../../../types";

export function DictList() {
  const { finalAllColumns, fetchList, handleSetRefetch, addAction } =
    useDictList(baseColumns);
  return (
    <div>
      <GenericFilterableList<DictInfo, DictFilterListParams>
        columns={finalAllColumns}
        searchFields={searchFields}
        fetcher={fetchList}
        showIndexColumn={true}
        onRefetch={handleSetRefetch}
        renderSearchActions={addAction}
      />
    </div>
  );
}
