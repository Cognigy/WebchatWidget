import { useState } from "react"
import { v4 as uuidv4 } from "uuid"

export const useRandomId = (prefix = "") => {
	const [id] = useState(() => `${prefix}-${uuidv4()}`);

    return id;
}