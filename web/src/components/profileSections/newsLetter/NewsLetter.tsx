import SharedNewsLetter from "@/components/shared/SharedNewsLetter";
import { useState } from "react";

export default function Newsletter() {
    const [subscribed, setSubscribed] = useState(true)

    return (
        <SharedNewsLetter subscribed={subscribed} setSubscribed={setSubscribed}/>
    )
}