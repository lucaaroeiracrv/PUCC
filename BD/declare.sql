/*
declare
    c_pi constant number(5,4) := 3.1415;
    v_raio natural;
    v_comp number;
begin
    v_raio := 123;
    v_comp := 2 * c_pi * v_raio;
    dbms_output.put_line('o comprimento da circunferência é: ' || v_comp);
end;
/
*/

-- TEMA DA AULA: cursores

/*
create table consoles(
    id number(4) not null primary key,
    name varchar2(20) not null,
    factory_brand varchar2(20) not null
);
*/

-- inserindo os registros na tabela
insert into consoles (id, name, factory_brand) values (1, 'Atari 2600', 'Atari');
insert into consoles (id, name, factory_brand) values (2, 'Master System', 'Sega');
insert into consoles (id, name, factory_brand) values (3, 'Nintendo 8 bits', 'Nintendo');
commit;

-- verificando os registros
select * from consoles;

-- primeiro tipo de cursor: implícito
-- funciona através do comando select into

declare
    v_name consoles.name%type;
begin
    select name into v_name from consoles where factory_brand = 'Sony';

    dbms_output.put_line('o nome do console é: ' || v_name);
end;
/
/*
alter table consoles modify name varchar2(50);
insert into consoles (id, name, factory_brand) values (4, 'PlayStation 5 GTA 6 Limited Edition Gold', 'Sony');
commit;
*/



-- CURSORES EXPLÍCITOS
-- cursores explícitos são utilizados quando o select retorna mais de um registro 
-- e percorrer resultados dentro de um programa PL/SQL
declare
    -- quando declaramos um cursor, ele não roda o comando
    cursor c_consoles is select * from consoles;
begin
    for r_consoles in c_consoles loop
        dbms_output.put_line('id: ' || r_consoles.id || ' name: ' || r_consoles.name || ' factory_brand: ' || r_consoles.factory_brand);
    end loop;
end;
/
-----------------------------
declare
    -- quando declaramos um cursor, ele não roda o comando
    r_consoles consoles%rowtype;
    cursor c_consoles is select * from consoles;
begin
    open c_consoles;
    loop
        fetch c_consoles into r_consoles;
        exit when c_consoles%notfound;
        dbms_output.put_line('id: ' || r_consoles.id || ' name: ' || r_consoles.name || ' factory_brand: ' || r_consoles.factory_brand);
    end loop;
    close c_consoles;
    
end;
/



---------------------------
-- CURSORES PARAMÉTRICOS(PARAMETRIZADOS)

declare
    -- quando declaramos um cursor, ele não roda o comando
    r_consoles consoles%rowtype;
    cursor c_consoles (brand varchar2)
    is select * from consoles where factory_brand = brand;
begin
    open c_consoles ('Sony');
    loop
        fetch c_consoles into r_consoles;
        exit when c_consoles%notfound;

        dbms_output.put_line('id: ' || r_consoles.id || ' name: ' || r_consoles.name || ' factory_brand: ' || r_consoles.factory_brand);
    end loop;
    close c_consoles;
    
end;
/