import { Toaster as ReactHotToaster } from "react-hot-toast";

export default function Toaster() {
  return <ReactHotToaster containerStyle={{ zIndex: 99999 }} />
}
