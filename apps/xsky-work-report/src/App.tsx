/* eslint-disable no-case-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { parse } from 'csv-parse/browser/esm';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './index.css';
import { Button } from './components/ui/button';
import { cn, getDates } from './lib/utils';
import ReactDOM from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Label } from './components/ui/label';
import { Alert, AlertDescription, AlertTitle } from './components/ui/alert';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './components/ui/collapsible';
import { CaretSortIcon } from '@radix-ui/react-icons';
import { Textarea } from './components/ui/textarea';
import React from 'react';
import dayjs from 'dayjs';
import { HolidayResponse } from './type/holiday';

type FormValue = {
  type: number;
  value: any;
};
type FormValueWithInfo = FormValue & {
  name: string;
  valueLabel?: string;
};

interface KeyValue {
  date: string;
  description: string;
  duration: string;
}

function FormButton({ onOpen }: { onOpen: () => void }) {
  const button = (
    <div className="flex justify-center">
      <Button onClick={() => onOpen()}>
        <span>快速填写工时</span>
      </Button>
    </div>
  );

  const form = document.querySelector('form');
  const buttonContainer = document.createElement('div');

  if (form) {
    form.append(buttonContainer);
    return ReactDOM.createPortal(button, buttonContainer);
  }

  return null;
}

const FormButtonMemo = React.memo(FormButton);

function App() {
  const [open, setOpen] = useState(false);
  const [formValueVisible, setFormValueVisible] = useState(true);
  const [formFieldMap, setFormFieldMap] = useState(null);
  const [formValues, setFormValues] = useState<
    Record<string, FormValueWithInfo>
  >({});
  const [keyValueCSV, setKeyValueCSV] = useState<string>('');
  const [keyValues, setKeyValues] = useState<KeyValue[] | null>([]);
  const [result, setResult] = useState<{ index: number; status: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const hasEmpty = useMemo(() => {
    return Object.entries(formValues).some(([, value]) => {
      return !value.value || value.value.length === 0;
    });
  }, [formValues]);

  // 将 csv 转成 key value 对
  useEffect(() => {
    if (!keyValueCSV) return;
    parse(
      keyValueCSV,
      {
        columns: ['date', 'duration', 'description'],
      },
      (err, output) => {
        if (err) {
          console.log(err);
          setKeyValues(null);
        }
        setKeyValues(output);
      },
    );
  }, [keyValueCSV]);

  const formHandler: (
    type: number,
    dom: HTMLDivElement,
  ) => { value: any; valueLabel?: string } = useCallback(
    (type: number, dom: HTMLDivElement) => {
      if (type === 18) {
        // 多选 找出 ul 下的所有 li 的 date-id 属性
        const lis = dom.querySelector('ul')?.querySelectorAll('li') ?? [];
        const value = Array.from(lis).map((li) => li.getAttribute('data-id'));
        return {
          value,
          valueLabel: Array.from(lis)
            .map((li) => li.textContent)
            .join(','),
        };
      }

      return {
        value: null,
      };
    },
    [],
  );

  // 获取表单元数据
  useEffect(() => {
    const timer = setInterval(() => {
      const formMetaContent = (window as any).formMetaContent;
      if (formMetaContent) {
        clearInterval(timer);
        const snapshot = JSON.parse(formMetaContent.Snapshot);

        const fieldMap = snapshot.fieldMap;
        setFormFieldMap(fieldMap);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 获取当前表单填写的数据，除了工时，工作描述，时间
  const handleGetFormValues = useCallback(() => {
    const excludeFieldIds = ['fldf5lrsvf', 'fldbCIeBdk', 'fldKRetrDH'];

    function selectElementsWithIdPattern(pattern: string) {
      if (!formFieldMap) return;
      // 获取页面上的所有元素
      const allElements = document.querySelectorAll('*');

      // 筛选出 ID 符合指定模式的元素
      const matchedElements = Array.from(allElements)
        .filter((element) => {
          return element.id && element.id.startsWith(pattern);
        })
        .filter((element) => {
          const elementId = element.id.replace(pattern, '');
          return !excludeFieldIds.includes(elementId);
        })
        .map((element) => {
          const elementId = element.id.replace(pattern, '');
          const type = (formFieldMap[elementId] as any).type;
          const { value, valueLabel } = formHandler(
            type,
            element as HTMLDivElement,
          );
          return {
            id: elementId,
            type,
            value,
            valueLabel,
            name: (formFieldMap[elementId] as any).name,
          };
        });

      return matchedElements;
    }

    setFormValues((prev) => {
      const elementsWithFieldItemId =
        selectElementsWithIdPattern('field-item-');
      if (!elementsWithFieldItemId) return prev;
      const newValues = elementsWithFieldItemId.reduce(
        (acc, cur) => {
          acc[cur.id] = cur;
          return acc;
        },
        {} as Record<string, FormValueWithInfo>,
      );

      return newValues;
    });
  }, [formFieldMap, formHandler]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    handleGetFormValues();
    setResult([]);
  }, [handleGetFormValues]);

  const handleConfirm = useCallback(() => {
    if (keyValues === null) return;
    const csrfToken = / _csrf_token=(.*?);/.exec(document.cookie)?.[1];
    if (submitting) {
      return;
    }
    setSubmitting(true);

    const formData = keyValues.map((keyValue) => {
      const { date, description, duration } = keyValue;
      const formValuesCopy: Record<string, FormValue> = {
        ...formValues,
        fldbCIeBdk: {
          type: 5,
          value: null,
        },
        fldKRetrDH: {
          type: 1,
          value: null,
        },
        fldf5lrsvf: {
          type: 2,
          value: null,
        },
      };
      formValuesCopy.fldbCIeBdk.value = new Date(`${date} 00:00:00`).getTime();
      formValuesCopy.fldKRetrDH.value = [{ type: 'text', text: description }];
      formValuesCopy.fldf5lrsvf.value = +duration;
      const data = Object.entries(formValuesCopy).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            type: value.type,
            value: value.value,
          };
          return acc;
        },
        {} as Record<string, any>,
      );
      return data;
    });

    const reqResult = formData.map((_data, i) => {
      return {
        index: i,
        status: '准备发送请求 ⌛️',
      };
    });

    setResult(reqResult);

    formData.forEach((data, index) => {
      setTimeout(() => {
        const body = JSON.stringify({
          shareToken: 'shrcnR7Vw5cojv93EWdWrp3art8',
          data: JSON.stringify(data),
          preUploadEnable: false,
        });

        if (csrfToken) {
          fetch('https://xskydata.feishu.cn/space/api/bitable/share/content', {
            headers: {
              'x-csrftoken': csrfToken,
            },
            referrer:
              'https://xskydata.feishu.cn/share/base/form/shrcnR7Vw5cojv93EWdWrp3art8',
            referrerPolicy: 'strict-origin-when-cross-origin',
            body: body,
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
          })
            .then((res) => {
              if (res.ok) {
                reqResult[index].status = '提交完成 ✅';
                setResult([...reqResult]);
              } else {
                reqResult[index].status = `提交失败 ❌(${res.json()})`;
                setResult([...reqResult]);
              }
            })
            .catch(() => {
              reqResult[index].status = '提交失败 ❌';
              setResult([...reqResult]);
            });
        }
      }, index * 1000);
    });
  }, [formValues, keyValues, submitting]);

  useEffect(() => {
    if (!submitting) {
      return;
    }

    if (result.every((item) => item.status !== '⌛️')) {
      setSubmitting(false);
    }
  }, [submitting, result]);

  // 更新表单数据
  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        // We only accept messages from ourselves
        if (event.source !== window) {
          return;
        }
        if (event.data?.type === 'RETURN_WORKDAY') {
          const data: HolidayResponse = event.data?.data;

          const availableDates = Object.entries(data.holiday)
            .filter(([date, value]) => {
              // 如果日期是周末，需要 holiday 为 false
              // 如果日期是工作日，需要 value 为 null 或者 holiday 为 false
              const day = dayjs(date).day();
              if (day === 0 || day === 6) {
                return value?.holiday === false;
              }
              return value === null || value.holiday === false;
            })
            .map(([date]) => date);

          const result = availableDates.map((item) => item + ',8,').join('\n');

          setKeyValueCSV(result);
        }
      },
      false,
    );
  }, []);

  return (
    <div className="relative max-w-[780px] overflow-auto text-black">
      {!open && (
        <Alert
          className={cn(
            'fixed right-0 top-[100px] z-10 w-fit overflow-hidden rounded-[8px_0_0_8px] border-transparent bg-primary',
            'text-white shadow-md',
          )}
        >
          <AlertTitle>🚀 快速填写工时插件已启动</AlertTitle>
          <AlertDescription>
            请在填写完类别等信息后，再点击提交按钮
          </AlertDescription>
        </Alert>
      )}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (open === false) {
            if (submitting) {
              alert('正在提交中，请稍后再试');
            } else {
              setOpen(open);
            }
          } else {
            setOpen(open);
          }
        }}
      >
        <DialogContent
          className="text-black sm:max-w-[780px]"
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>快速填写表单</DialogTitle>
            <DialogDescription>
              根据表单内容快速填写工时，工作描述，时间，批量提交表单
            </DialogDescription>
          </DialogHeader>
          {hasEmpty && (
            <Alert className="bg-red-500 text-white">
              <AlertDescription>
                有必填项未填写，请填写完整后再提交
              </AlertDescription>
            </Alert>
          )}
          <Collapsible
            open={formValueVisible}
            onOpenChange={setFormValueVisible}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">重复表单内容</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <CaretSortIcon className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="space-y-2">
              <div className="flex flex-col gap-2">
                {Object.entries(formValues).map(([key, value]) => {
                  return (
                    <div key={key}>
                      {value.name}: {value.valueLabel}
                    </div>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
          {result.length < 1 && (
            <div className="flex min-h-[300px] flex-col gap-4 py-4">
              <div className="flex flex-col gap-4">
                <Label htmlFor="name" className="">
                  csv
                  格式填写(日期,工时,描述，每一天一行，描述中间不要有英文逗号)
                </Label>
                <div className="inline-flex items-center justify-start gap-1">
                  <DateButton
                    title="本周"
                    dates={getDates(
                      dayjs().day(0).toDate(),
                      dayjs().day(6).toDate(),
                    )}
                  ></DateButton>
                  <DateButton
                    title="上周"
                    dates={getDates(
                      dayjs().subtract(1, 'week').toDate(),
                      dayjs().subtract(1, 'week').toDate(),
                    )}
                  ></DateButton>
                  <DateButton
                    title="本月"
                    dates={getDates(
                      dayjs().startOf('month').toDate(),
                      dayjs().endOf('month').toDate(),
                    )}
                  ></DateButton>
                  <DateButton
                    title="上月"
                    dates={getDates(
                      dayjs().subtract(1, 'month').startOf('month').toDate(),
                      dayjs().subtract(1, 'month').endOf('month').toDate(),
                    )}
                  ></DateButton>
                </div>
                <Textarea
                  value={keyValueCSV}
                  placeholder="请选择上方的时间范围，自动过滤掉节假日，周末"
                  onChange={(e) => setKeyValueCSV(e.target.value)}
                ></Textarea>
                <div>
                  {keyValues ? (
                    <div>
                      共 {keyValues.length} 个工作日，工时总数:
                      {keyValues?.reduce((acc, cur) => {
                        return acc + Number(cur.duration);
                      }, 0)}{' '}
                      个小时
                    </div>
                  ) : (
                    <div className="text-red-500">csv 解析失败</div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="flex  flex-col gap-2 py-2">
            {result.map((item) => {
              return (
                <div key={item.index}>
                  {`${keyValues?.[item.index].date}`}: {item.status}
                </div>
              );
            })}
            {!!result.length &&
              result.every((item) => item.status.includes('✅')) && (
                <div className="mt-2 text-xl font-bold">
                  🎉 工时填写完毕，请在「研发工时统计」表格进行确认
                </div>
              )}
          </div>
          <DialogFooter>
            {result.length < 1 && (
              <Button
                type="button"
                onClick={handleConfirm}
                disabled={hasEmpty || submitting}
              >
                提交
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FormButtonMemo onOpen={handleOpen}></FormButtonMemo>
    </div>
  );
}

export default App;

// 点击之后发送请求，获取节假日信息
function DateButton({ title, dates }: { title: string; dates: string[] }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener(
      'message',
      (event) => {
        // We only accept messages from ourselves
        if (event.source !== window) {
          return;
        }
        if (event.data?.type === 'RETURN_WORKDAY') {
          setLoading(false);
        }
      },
      false,
    );
  }, []);

  const handleClick = useCallback(async () => {
    if (loading) return;

    window.postMessage({ type: 'GET_WORKDAY', dates: dates }, '*');
    setLoading(true);
  }, [dates, loading]);

  return (
    <div
      className={cn(
        'cursor-pointer rounded-sm bg-primary px-2 py-1 text-white hover:text-purple-300',
        {
          'opacity-50': loading,
        },
      )}
      onClick={handleClick}
    >
      {title}
    </div>
  );
}
