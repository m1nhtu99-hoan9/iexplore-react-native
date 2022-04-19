import { WebSQLDatabase } from "expo-sqlite";
import * as R from "ramda";

import { Activity, ActivityDbItem } from "../domain/Activity.d";
import {
  addNewActivityAsync,
  deleteActivityAsync,
  queryDbTableNamesAsync,
  queryAllActivitiesAsync,
  updateActivityAsync
} from "../persistence";
import { deleteAllActivitiesAsync } from "../persistence/activity";

export default class ActivityDbService {
  private _activities: Readonly<ActivityDbItem[]> = [];

  constructor(private readonly db: WebSQLDatabase) {
    console.info("[ActivityDbService.ctor] Query all existing activities...")
    queryAllActivitiesAsync(db)
      .then(xs => {
        this._activities = xs;
        console.debug(`[ActivityDbService.ctor] 'activities' initiated: ${ JSON.stringify(this._activities) }`)
      });
  }

  public get activities(): Readonly<ActivityDbItem[]> {
    return this._activities;
  }

  public async add(newActivity: Activity): Promise<number | undefined> {
    console.debug(`[ActivityDbService.add] entered with: newActivity = ${ JSON.stringify(newActivity) }`)
    const addedActivityId = await addNewActivityAsync(this.db, newActivity)

    if (addedActivityId !== undefined) {
      this._activities = [
        ...this._activities,
        { activityId: addedActivityId, ...newActivity } as ActivityDbItem
      ];
      console.info(`[ActivityDbService.add] Activity added with ID [${ addedActivityId }]`);
      console.debug(`[ActivityDbService.add] 'activities' set to: ${ JSON.stringify(this._activities) }`)
    } else {
      console.warn(`[ActivityDbService.add] Activity [${ newActivity.name }] has not been added to the database.`);
    }

    return addedActivityId;
  }

  public async update(id: number, modifiedActivity: Activity): Promise<boolean> {

    const isSucceed = await updateActivityAsync(this.db, id, modifiedActivity);

    if (isSucceed) {
      this._activities = [
        ...R.reject(R.propEq("activityId", id), this._activities),
        { activityId: id, ...modifiedActivity } as ActivityDbItem
      ];
      console.debug(`[ActivityDbService.update] 'activities' set to: ${ JSON.stringify(this._activities) }`)
    } else {
      console.warn(`[ActivityDbService.update] Failed to update Activity with ID [${ id }] for unknown reason(s).`);
    }

    return isSucceed;
  }

  public async delete(id: number): Promise<boolean> {
    const isSucceed = await deleteActivityAsync(this.db, id);

    if (isSucceed) {
      this._activities = R.reject(R.propEq("activityId", id), this._activities);
      console.info(`[ActivityDbService.delete] Activity with ID [${ id }] has been successfully removed in the database.`);
      console.debug(`[ActivityDbService.delete] 'activities' set to: ${ JSON.stringify(this._activities) }`)
    } else {
      console.warn(`[ActivityDbService.delete] Failed to remove Activity with ID [${ id }] for unknown reason(s).`);
    }

    return isSucceed;
  }

  public async deleteAll(): Promise<number> {
    const rowsAffected = await deleteAllActivitiesAsync(this.db);
    console.assert(rowsAffected === R.length(this._activities));

    this._activities = [];
    console.info(`[ActivityDbService.deleteAll] Deleted ${ rowsAffected } activity record(s).`);
    return rowsAffected;
  }
}