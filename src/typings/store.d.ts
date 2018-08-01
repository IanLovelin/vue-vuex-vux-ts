declare namespace StoreState {

    interface User {
        name: string,
        age: number
    }
    export interface IAllMembers {
        [key: string]: any;

    }
    export interface ISearchList {

    }
    export interface ILoadTaskList {

    }
    export interface IRemainWorkload {

    }
    export interface IOneMemberTask {
        TechReLmt: string;
        beginTime: string;
        customerFullName: string;
        customerShortName: string;
        devName: string;
        endTime: string;
        id: number;
        manager: string;
        managerDeparmentName: string;
        managerName: string;
        memberGuid: string;
        memberwWrkload: number;
        pm: string;
        pmDepartmentName: string;
        pmName: string;
        protoType: string;
        protoUrl: string;
        requirementCode: string;
        subject: string;
        taskDoneLmt: string;
        taskGuid: string;
        type: string;
        workload: number
        yjEndDate: string | null;
        yjSubmitDate: string | null;
        remainingWorkload: number;
        isAllocatedOver: boolean;
        isImportant: number;
    }
    export interface IMember {
        memberGuid: string;
        memberName: string;
        memberOpenId: string;
        memberCode: string;
        memberIcon: string;
        tasks: Array<{}>;
        maxSeries: any;
        index: any;
        taskGuid: string;
    }
    export interface ITaskMember {
        members: Array<{}>;
        taskGuid: string;
    }
}