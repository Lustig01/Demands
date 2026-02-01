
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Demand } from "../../../api/types";
import { useDemands } from "../../../hooks/use-demands";

interface DemandDialogProps {
    open: boolean;
    onClose: () => void;
    demand: Demand | null;
    mode: "view" | "edit";
}

const schema = z.object({
    value: z.number().min(0, "Value must be positive"),
});

type FormData = z.infer<typeof schema>;

export default function DemandDialog({ open, onClose, demand, mode }: DemandDialogProps) {
    const { update } = useDemands();

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            value: demand?.value || 0,
        },
    });

    useEffect(() => {
        if (demand) {
            reset({
                value: demand.value,
            });
        }
    }, [demand, reset]);

    const onSubmit = async (data: FormData) => {
        if (!demand) return;
        try {
            await update({ id: demand.id, data: { value: data.value } });
            onClose();
        } catch (error) {
            console.error("Failed to update demand", error);
        }
    };

    if (!demand) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                {mode === "edit" ? "עריכת דרישה" : "פרטי דרישה"}
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Grid container spacing={2}>
                        {/* Read-only info */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">פרויקט</Typography>
                            <Typography variant="body1">{demand.projectName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">סטטוס</Typography>
                            <Typography variant="body1">{demand.status}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">שירות</Typography>
                            <Typography variant="body1">{demand.serviceName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">משאב</Typography>
                            <Typography variant="body1">{demand.resourceName}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">מיקום</Typography>
                            <Typography variant="body1">
                                {demand.location ? `${demand.location.baseName} / ${demand.location.environmentName}` : "-"}
                            </Typography>
                        </Grid>

                        {/* Editable fields */}
                        <Grid size={{ xs: 12, md: 6 }}>
                            {mode === "edit" ? (
                                <TextField
                                    label="כמות מבוקשת"
                                    type="number"
                                    fullWidth
                                    {...register("value", { valueAsNumber: true })}
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                />
                            ) : (
                                <>
                                    <Typography variant="subtitle2" color="text.secondary">כמות מבוקשת</Typography>
                                    <Typography variant="body1">{demand.value}</Typography>
                                </>
                            )}
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2" color="text.secondary">כמות מאושרת</Typography>
                            <Typography variant="body1">{demand.approvedValue ?? "-"}</Typography>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>סגור</Button>
                    {mode === "edit" && (
                        <Button type="submit" variant="contained" disabled={isSubmitting}>
                            שמור
                        </Button>
                    )}
                </DialogActions>
            </form>
        </Dialog>
    );
}
