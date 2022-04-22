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
import { IActivityDbService } from "./typings";

export default class ActivityDbService implements IActivityDbService {
  private _activities: Readonly<ActivityDbItem[]> = [];

  constructor(private readonly db: WebSQLDatabase) {
    console.info("[ActivityDbService.ctor] Query all existing activities...")
    queryAllActivitiesAsync(db)
      .then(xs => {
        this._activities = xs;
        console.debug(`[ActivityDbService.ctor] 'activities' initiated: ${ JSON.stringify(this._activities) }\n`)
      });
  }

  public get activities() {
    return this._activities;
  }

  public async filter(searchPhrase: string) {
    const normalisedSearchPhrase = searchPhrase?.toLowerCase();

    return new Promise<readonly ActivityDbItem[]>((resolve, reject) => {
      try {
        if (R.isNil(normalisedSearchPhrase) || R.isEmpty(normalisedSearchPhrase.trim())) {
          resolve(this.activities);
          return;
        }

        const filteredActivities = R.filter<ActivityDbItem>(
          x => x.name.toLowerCase().includes(normalisedSearchPhrase)
            || x.reporterName.toLowerCase().includes(normalisedSearchPhrase)
            || !R.isNil(x.location) && x.location.toLowerCase().includes(normalisedSearchPhrase)
        )(this._activities);

        console.debug(`[ActivityDbService.filter] Filtered activities: ${ JSON.stringify(filteredActivities) }\n`);

        resolve(filteredActivities);
      } catch (e) {
        reject(e);
      }
    });
  }

  public async add(newActivity: Activity) {
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

  public async update(id: number, modifiedActivity: Activity) {
    try {
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
    } catch (e) {
      console.error(`[ActivityDbService.update] Failed to update Activity with ID [${ id }].\n${ e.message }`);
      throw e;
    }
  }

  public async delete(id: number) {
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

  public async deleteAll() {
    const rowsAffected = await deleteAllActivitiesAsync(this.db);
    console.assert(rowsAffected === R.length(this._activities));

    this._activities = [];
    console.info(`[ActivityDbService.deleteAll] Deleted ${ rowsAffected } activity record(s).`);
    return rowsAffected;
  }
}