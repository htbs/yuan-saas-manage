import React from 'react';
import { Button, Card } from "antd";
import {FormStatus} from "@src/components/layout/Detailheader/types";

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    title: {
        color: '#1f2937',
        margin: 0,
        fontSize: '16px',
    },
    subtitle: {
        fontSize: '12px',
        color: '#9ca3af',
        marginTop: '4px',
    },
    btnGroup: {
        display: 'flex',
        gap: '12px',
    },
};

const DetailHeader = (
    { mode, title, onBack, onSave, loading }: { mode: FormStatus, title: string, onBack: () => void, onSave: () => void, loading: boolean }
) => {

    return (
        <Card size="small">
            <div style={styles.header}>
                <div style={styles.titleGroup}>
                    <div style={styles.title}>{ title }</div>
                    {/*编辑和详情的时候可以显示小标题*/}
                    {[FormStatus.edit, FormStatus.detail].includes(mode) && <div style={styles.subtitle}>这里可以显示数据小标题</div>}
                </div>
                <div style={styles.btnGroup}>
                    <Button onClick={onBack}>取消</Button>
                    {/*不是详情展示的时候才有保存按钮*/}
                    {mode !== FormStatus.detail && (
                        <Button color="primary" variant="solid" onClick={onSave}
                                disabled={loading}>
                            {loading ? '保存中...' : '保存'}
                        </Button>
                    )}
                </div>
            </div>
        </Card>

    );
};

export default DetailHeader;