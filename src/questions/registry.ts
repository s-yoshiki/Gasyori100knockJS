/** 解答レジストリ（自動生成 / DO NOT EDIT）。 */

import Ans001 from './answers/Ans001'
import Ans002 from './answers/Ans002'
import Ans003 from './answers/Ans003'
import Ans004 from './answers/Ans004'
import Ans005 from './answers/Ans005'
import Ans006 from './answers/Ans006'
import Ans007 from './answers/Ans007'
import Ans008 from './answers/Ans008'
import Ans009 from './answers/Ans009'
import Ans010 from './answers/Ans010'
import Ans011 from './answers/Ans011'
import Ans012 from './answers/Ans012'
import Ans013 from './answers/Ans013'
import Ans014 from './answers/Ans014'
import Ans015 from './answers/Ans015'
import Ans016 from './answers/Ans016'
import Ans017 from './answers/Ans017'
import Ans018 from './answers/Ans018'
import Ans019 from './answers/Ans019'
import Ans020 from './answers/Ans020'
import Ans021 from './answers/Ans021'
import Ans022 from './answers/Ans022'
import Ans023 from './answers/Ans023'
import Ans024 from './answers/Ans024'
import Ans025 from './answers/Ans025'
import Ans026 from './answers/Ans026'
import Ans027 from './answers/Ans027'
import Ans028 from './answers/Ans028'
import Ans029 from './answers/Ans029'
import Ans030 from './answers/Ans030'
import Ans031 from './answers/Ans031'
import Ans032 from './answers/Ans032'
import Ans033 from './answers/Ans033'
import Ans034 from './answers/Ans034'
import Ans035 from './answers/Ans035'
import Ans036 from './answers/Ans036'
import Ans037 from './answers/Ans037'
import Ans038 from './answers/Ans038'
import Ans039 from './answers/Ans039'
import Ans040 from './answers/Ans040'
import Ans041 from './answers/Ans041'
import Ans042 from './answers/Ans042'
import Ans043 from './answers/Ans043'
import Ans044 from './answers/Ans044'
import Ans045 from './answers/Ans045'
import Ans047 from './answers/Ans047'
import Ans048 from './answers/Ans048'
import Ans049 from './answers/Ans049'
import Ans050 from './answers/Ans050'
import Ans051 from './answers/Ans051'
import Ans052 from './answers/Ans052'
import Ans053 from './answers/Ans053'
import Ans054 from './answers/Ans054'
import Ans055 from './answers/Ans055'
import Ans056 from './answers/Ans056'
import Ans057 from './answers/Ans057'
import Ans058 from './answers/Ans058'
import Ans059 from './answers/Ans059'
import Ans060 from './answers/Ans060'
import Ans061 from './answers/Ans061'
import Ans062 from './answers/Ans062'
import Ans063 from './answers/Ans063'
import Ans064 from './answers/Ans064'
import Ans065 from './answers/Ans065'
import Ans070 from './answers/Ans070'
import Ans071 from './answers/Ans071'
import Ans072 from './answers/Ans072'
import Ans073 from './answers/Ans073'
import Ans074 from './answers/Ans074'
import Ans075 from './answers/Ans075'
import Ans076 from './answers/Ans076'
import Ans077 from './answers/Ans077'
import Ans078 from './answers/Ans078'
import Ans079 from './answers/Ans079'
import Ans080 from './answers/Ans080'
import Ans081 from './answers/Ans081'
import Ans082 from './answers/Ans082'
import Ans083 from './answers/Ans083'
import Ans084 from './answers/Ans084'
import Ans085 from './answers/Ans085'
import Ans086 from './answers/Ans086'
import Ans087 from './answers/Ans087'
import Ans088 from './answers/Ans088'
import type { AnswerFactory } from './base'

export const answers: Readonly<Record<number, AnswerFactory>> = {
  1: Ans001,
  2: Ans002,
  3: Ans003,
  4: Ans004,
  5: Ans005,
  6: Ans006,
  7: Ans007,
  8: Ans008,
  9: Ans009,
  10: Ans010,
  11: Ans011,
  12: Ans012,
  13: Ans013,
  14: Ans014,
  15: Ans015,
  16: Ans016,
  17: Ans017,
  18: Ans018,
  19: Ans019,
  20: Ans020,
  21: Ans021,
  22: Ans022,
  23: Ans023,
  24: Ans024,
  25: Ans025,
  26: Ans026,
  27: Ans027,
  28: Ans028,
  29: Ans029,
  30: Ans030,
  31: Ans031,
  32: Ans032,
  33: Ans033,
  34: Ans034,
  35: Ans035,
  36: Ans036,
  37: Ans037,
  38: Ans038,
  39: Ans039,
  40: Ans040,
  41: Ans041,
  42: Ans042,
  43: Ans043,
  44: Ans044,
  45: Ans045,
  47: Ans047,
  48: Ans048,
  49: Ans049,
  50: Ans050,
  51: Ans051,
  52: Ans052,
  53: Ans053,
  54: Ans054,
  55: Ans055,
  56: Ans056,
  57: Ans057,
  58: Ans058,
  59: Ans059,
  60: Ans060,
  61: Ans061,
  62: Ans062,
  63: Ans063,
  64: Ans064,
  65: Ans065,
  70: Ans070,
  71: Ans071,
  72: Ans072,
  73: Ans073,
  74: Ans074,
  75: Ans075,
  76: Ans076,
  77: Ans077,
  78: Ans078,
  79: Ans079,
  80: Ans080,
  81: Ans081,
  82: Ans082,
  83: Ans083,
  84: Ans084,
  85: Ans085,
  86: Ans086,
  87: Ans087,
  88: Ans088,
}

export const implementedIds: readonly number[] = Object.keys(answers)
  .map(Number)
  .sort((a, b) => a - b)

export const TOTAL_QUESTIONS = 100

export const isImplemented = (id: number): boolean => id in answers

export const createAnswer = (id: number) => answers[id]?.() ?? null
