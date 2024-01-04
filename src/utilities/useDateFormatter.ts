// useDateFormatter.ts
import { ref, computed, Ref } from 'vue';

export default function useDateFormatter(isoDateString: string): { formattedDate: Ref<string> } {
    const date = ref(new Date(isoDateString));

    const formattedDate = computed(() => {
        const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
        const monthName = months[date.value.getMonth()];
        const day = date.value.getDate();
        const year = date.value.getFullYear();

        return `${monthName} ${day}, ${year}`;
    });

    return {
        formattedDate
    };
}