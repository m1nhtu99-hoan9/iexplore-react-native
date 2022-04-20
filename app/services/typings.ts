import { Activity, ActivityDbItem } from "../domain/Activity.d";

type Succeeded = boolean;
type NumRowsAffected = number;

export interface IActivityDbService {
  activities: readonly ActivityDbItem[],
  add(newActivity: Activity): Promise<ActivityDbItem['activityId'] | undefined>,
  update(id: ActivityDbItem['activityId'], modifiedActivity: Activity): Promise<Succeeded>,
  delete(id: ActivityDbItem['activityId']): Promise<Succeeded>,
  deleteAll(): Promise<NumRowsAffected>,
  filter(searchPhrase: string): Promise<readonly ActivityDbItem[]>
}