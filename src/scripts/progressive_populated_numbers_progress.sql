UPDATE numbers SET cashier = 500, "dateBet" = to_char(CURRENT_DATE + INTERVAL '20 days', 'dd/mm/yyyy')
WHERE "dateBet" = TO_CHAR(CURRENT_DATE - INTERVAL '1 day', 'DD/MM/YYYY');
