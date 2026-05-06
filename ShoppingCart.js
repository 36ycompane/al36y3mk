import java.util.*;

public class ShoppingCart {
    static ArrayList<String> cartItems = new ArrayList<>();
    static ArrayList<Double> cartPrices = new ArrayList<>();
    static ArrayList<Integer> cartQuantities = new ArrayList<>();

    static String[] menuItems = {"الساعة الذكية ", "التنقل الذكي", "جريش", "مرقوق", "حنيذ", "مظبي"};
    static double[] menuPrices = {30.0, 45.0, 25.0, 28.0, 50.0, 40.0};

    static Scanner input = new Scanner(System.in); // 👈 Scanner واحد فقط

    public static void main(String[] args) {

        System.out.println("🛒 نظام سلة طلبات المطعم");
        System.out.println("========================");

        boolean running = true;

        while (running) {
            showMainMenu();
            int choice = getIntInput("اختر الخيار: ");

            switch (choice) {
                case 1 -> showMenu();
                case 2 -> addToCart();
                case 3 -> viewCart();
                case 4 -> removeFromCart();
                case 5 -> checkout();
                case 6 -> {
                    running = false;
                    System.out.println("شكراً لاستخدامك نظام المطعم! 👋");
                }
                default -> System.out.println("❌ خيار غير صحيح!");
            }
        }
    }

    public static int getIntInput(String message) {
        while (true) {
            try {
                System.out.print(message);
                return input.nextInt();
            } catch (InputMismatchException e) {
                System.out.println("❌ أدخل رقم صحيح!");
                input.next(); // تنظيف الإدخال
            }
        }
    }

    public static void showMainMenu() {
        System.out.println("\n📋 القائمة الرئيسية:");
        System.out.println("1. 👀 عرض قائمة الطعام");
        System.out.println("2. ➕ إضافة طبق للسلة");
        System.out.println("3. 🛒 عرض السلة");
        System.out.println("4. 🗑️ حذف طبق من السلة");
        System.out.println("5. 💳 إتمام الطلب");
        System.out.println("6. ❌ خروج");
    }

    public static void showMenu() {
        System.out.println("\n🍽️ قائمة الطعام:");
        System.out.println("==================");
        for (int i = 0; i < menuItems.length; i++) {
            System.out.printf("%d. %s - %.2f ريال\n", i + 1, menuItems[i], menuPrices[i]);
        }
    }

    public static void addToCart() {
        showMenu();

        int itemChoice = getIntInput("\nاختر رقم الطبق: ");

        if (itemChoice < 1 || itemChoice > menuItems.length) {
            System.out.println("❌ رقم الطبق غير صحيح!");
            return;
        }

        int quantity = getIntInput("الكمية: ");

        if (quantity < 1) {
            System.out.println("❌ الكمية يجب أن تكون 1 أو أكثر!");
            return;
        }

        String itemName = menuItems[itemChoice - 1];
        double itemPrice = menuPrices[itemChoice - 1];

        int index = cartItems.indexOf(itemName);

        if (index != -1) {
            cartQuantities.set(index, cartQuantities.get(index) + quantity);
            System.out.println("✅ تم تحديث الكمية");
        } else {
            cartItems.add(itemName);
            cartPrices.add(itemPrice);
            cartQuantities.add(quantity);
            System.out.println("✅ تمت الإضافة للسلة");
        }
    }

    public static void viewCart() {
        if (cartItems.isEmpty()) {
            System.out.println("\n🛒 السلة فارغة!");
            return;
        }

        double total = 0;
        System.out.println("\n🛒 السلة:");

        for (int i = 0; i < cartItems.size(); i++) {
            double itemTotal = cartPrices.get(i) * cartQuantities.get(i);
            total += itemTotal;

            System.out.printf("%d. %s × %d = %.2f ريال\n",
                    i + 1,
                    cartItems.get(i),
                    cartQuantities.get(i),
                    itemTotal);
        }

        System.out.println("----------------");
        System.out.printf("💰 المجموع: %.2f ريال\n", total);

        if (total > 100) {
            double discount = total * 0.10;
            System.out.printf("🎁 خصم: %.2f ريال\n", discount);
            System.out.printf("💵 بعد الخصم: %.2f ريال\n", total - discount);
        }
    }

    public static void removeFromCart() {
        if (cartItems.isEmpty()) {
            System.out.println("🛒 السلة فارغة!");
            return;
        }

        viewCart();
        int index = getIntInput("اختر رقم الحذف: ") - 1;

        if (index < 0 || index >= cartItems.size()) {
            System.out.println("❌ رقم غير صحيح!");
            return;
        }

        System.out.println("✅ تم حذف " + cartItems.get(index));
        cartItems.remove(index);
        cartPrices.remove(index);
        cartQuantities.remove(index);
    }

    public static void checkout() {
        if (cartItems.isEmpty()) {
            System.out.println("🛒 السلة فارغة!");
            return;
        }

        double total = calculateTotal();
        double finalTotal = total;

        System.out.print("هل لديك كود خصم؟ (نعم/لا): ");
        String choice = input.next();

        if (choice.equalsIgnoreCase("نعم")) {
            System.out.print("أدخل الكود: ");
            String code = input.next();

            if (code.equalsIgnoreCase("KABSA20")) {
                double discount = total * 0.20;
                finalTotal -= discount;
                System.out.println("🎉 خصم 20% تم تطبيقه!");
            } else {
                System.out.println("❌ كود غير صحيح");
            }
        }

        System.out.println("\n💳 الفاتورة:");
        System.out.printf("المجموع: %.2f ريال\n", total);
        System.out.printf("الإجمالي: %.2f ريال\n", finalTotal);

        System.out.println("📦 رقم الطلب: ORD-" + System.currentTimeMillis());
        System.out.println("✅ تم الطلب بنجاح!");

        cartItems.clear();
        cartPrices.clear();
        cartQuantities.clear();
    }

    public static double calculateTotal() {
        double total = 0;
        for (int i = 0; i < cartItems.size(); i++) {
            total += cartPrices.get(i) * cartQuantities.get(i);
        }
        return total;
    }
}