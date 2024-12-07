// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.0.4
//   protoc               v5.27.3
// source: src/proto/doorStatus.pb.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "doorStatus";

export interface DoorStatusResponse {
  mode: DoorStatusResponse_Status;
}

export enum DoorStatusResponse_Status {
  LOCKED = 0,
  UNLOCKED = 1,
  RESTRICTED = 2,
  UNRECOGNIZED = -1,
}

export function doorStatusResponse_StatusFromJSON(object: any): DoorStatusResponse_Status {
  switch (object) {
    case 0:
    case "LOCKED":
      return DoorStatusResponse_Status.LOCKED;
    case 1:
    case "UNLOCKED":
      return DoorStatusResponse_Status.UNLOCKED;
    case 2:
    case "RESTRICTED":
      return DoorStatusResponse_Status.RESTRICTED;
    case -1:
    case "UNRECOGNIZED":
    default:
      return DoorStatusResponse_Status.UNRECOGNIZED;
  }
}

export function doorStatusResponse_StatusToJSON(object: DoorStatusResponse_Status): string {
  switch (object) {
    case DoorStatusResponse_Status.LOCKED:
      return "LOCKED";
    case DoorStatusResponse_Status.UNLOCKED:
      return "UNLOCKED";
    case DoorStatusResponse_Status.RESTRICTED:
      return "RESTRICTED";
    case DoorStatusResponse_Status.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface DoorStatusRequest {
}

function createBaseDoorStatusResponse(): DoorStatusResponse {
  return { mode: 0 };
}

export const DoorStatusResponse = {
  encode(message: DoorStatusResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.mode !== 0) {
      writer.uint32(8).int32(message.mode);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DoorStatusResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDoorStatusResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 8) {
            break;
          }

          message.mode = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DoorStatusResponse {
    return { mode: isSet(object.mode) ? doorStatusResponse_StatusFromJSON(object.mode) : 0 };
  },

  toJSON(message: DoorStatusResponse): unknown {
    const obj: any = {};
    if (message.mode !== 0) {
      obj.mode = doorStatusResponse_StatusToJSON(message.mode);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DoorStatusResponse>, I>>(base?: I): DoorStatusResponse {
    return DoorStatusResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DoorStatusResponse>, I>>(object: I): DoorStatusResponse {
    const message = createBaseDoorStatusResponse();
    message.mode = object.mode ?? 0;
    return message;
  },
};

function createBaseDoorStatusRequest(): DoorStatusRequest {
  return {};
}

export const DoorStatusRequest = {
  encode(_: DoorStatusRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DoorStatusRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDoorStatusRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): DoorStatusRequest {
    return {};
  },

  toJSON(_: DoorStatusRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<DoorStatusRequest>, I>>(base?: I): DoorStatusRequest {
    return DoorStatusRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DoorStatusRequest>, I>>(_: I): DoorStatusRequest {
    const message = createBaseDoorStatusRequest();
    return message;
  },
};

export interface DoorStatusService {
  GetDoorStatusRpc(request: DoorStatusRequest): Promise<DoorStatusResponse>;
}

export const DoorStatusServiceServiceName = "doorStatus.DoorStatusService";
export class DoorStatusServiceClientImpl implements DoorStatusService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || DoorStatusServiceServiceName;
    this.rpc = rpc;
    this.GetDoorStatusRpc = this.GetDoorStatusRpc.bind(this);
  }
  GetDoorStatusRpc(request: DoorStatusRequest): Promise<DoorStatusResponse> {
    const data = DoorStatusRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetDoorStatusRpc", data);
    return promise.then((data) => DoorStatusResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
