import { saveDataJson } from "../utils/saveDataJson.js";
import { $t, languageData } from "./translations.js";
import { state } from "./main.js";
import specialNotes from "../utils/specialNotes.json" assert { type: "json" };
import { getRarityColor } from "../utils/index.js";
import { getImageUrl } from "../constants.js";

const isGraffiti = (item) => {
	if (item.item_name.startsWith("#SprayKit_")) {
		return true;
	}

	if (item.name.includes("spray_")) {
		return true;
	}

	if (item.sticker_material?.includes("_graffiti")) {
		return true;
	}

	return false;
};

const getDescription = (item) => {
	let msg = $t("csgo_tool_spray_desc");
	let desc = $t(item.description_string);
	if (desc && desc.length > 0) {
		msg = `${msg}<br><br>${desc}`;
	}
	return msg;
};

const parseItemSealedGraffiti = (item) => {
	const { cratesBySkins, graffitiTints } = state;
	const image = getImageUrl(`econ/stickers/${item.sticker_material}`);

	const crates =
		cratesBySkins?.[`graffiti-${item.object_id}`]?.map((i) => ({
			...i,
			name: $t(i.name),
		})) ?? [];
	const description = getDescription(item);
	return {
		id: `graffiti-${item.object_id}`,
		name: `${$t("csgo_tool_spray")} | ${$t(item.item_name)}`,
		description,
		rarity: {
			id: `rarity_${item.item_rarity}`,
			name: $t(`rarity_${item.item_rarity}`),
			color: getRarityColor(`rarity_${item.item_rarity}`),
		},
		special_notes: specialNotes?.[`graffiti-${item.object_id}`],
		crates,
		image,
		tints:
			crates.length === 0 && item.item_rarity === "common"
				? graffitiTints.map((tint) => ({
						...tint,
						name: $t(tint.key),
				  }))
				: [],
	};
};

export const getGraffiti = () => {
	const { stickerKits } = state;
	const { folder } = languageData;

	const graffiti = stickerKits.filter(isGraffiti).map(parseItemSealedGraffiti);

	saveDataJson(`./resource/${folder}/graffiti.json`, graffiti);
};
