import { $authHost, $host } from "./index";

export const createTagGroup = async (name: string) => {
  const { data } = await $authHost.post("api/tag/group", { name });
  return data;
};
export const deleteTagGroup = async (id: number) => {
  const { data } = await $authHost.delete("api/tag/group/" + id);
  return data;
};
export const fetchTagGroups = async () => {
  const { data } = await $host.get("api/tag/group");
  return data;
};

export const createTag = async (value: string, groupId: number) => {
  const { data } = await $authHost.post("api/tag", {
    value,
    groupId,
  });
  return data;
};
export const deleteTag = async (id: number) => {
  const { data } = await $authHost.delete("api/tag/" + id);
  return data;
};
export const fetchTagsByGroup = async (id: number) => {
  const { data } = await $host.get("api/tag/" + id);
  return data;
};
