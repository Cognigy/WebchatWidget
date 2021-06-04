import { useState } from "react"
import uuid from "uuid"

export const useRandomId = (prefix = "") => {
    const [id] = useState(() => `${prefix}-${uuid.v4()}`);

    return id;
}