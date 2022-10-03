import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useUserContext } from "..";
import { onExchange } from "../App";
//@ts-ignore
import { deleteDevice, fetchDevices } from "../http/deviceAPI";
import DeviceItem from "./DeviceItem";

const DeviceList = observer(() => {
  const { device } = useUserContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices(device?.order, device?.page, device?.limit)
      .then((data) => {
        //@ts-ignore
        device?.setDevices(onExchange(data.rows, device?.exchangeRate));
        device?.setFilteredDevices(data.rows);
        device?.setDevicesCount(data.count);
      })
      .finally(() => setLoading(false));
  }, [device?.order, device?.page, device?.count]);

  const onDelete = async (id: number) => {
    await deleteDevice(id).then(() =>
      fetchDevices(device?.order, device?.page, device?.limit).then((data) => {
        device?.setDevices(onExchange(data.rows, device?.exchangeRate));
        device?.setDevicesCount(data.count);
      })
    );
  };

  if (loading) {
    return <>Загрузка</>;
  }

  return (
    <main className="main-items">
      {device?.filteredDevices.map((e) => {
        return <DeviceItem key={e.id} device={toJS(e)} onDelete={onDelete} />;
      })}
    </main>
  );
});

export default DeviceList;
