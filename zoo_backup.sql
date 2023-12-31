PGDMP     &                    {            bixo    15.1    15.1 7    P           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            Q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            R           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            S           1262    16958    bixo    DATABASE     {   CREATE DATABASE bixo WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Portuguese_Brazil.1252';
    DROP DATABASE bixo;
                postgres    false            n           1247    17554    black_list_timebet_enum    TYPE     �   CREATE TYPE public.black_list_timebet_enum AS ENUM (
    '11:00:00',
    '14:00:00',
    '16:00:00',
    '18:00:00',
    '21:00:00'
);
 *   DROP TYPE public.black_list_timebet_enum;
       public          postgres    false            P           1247    16960    games_modality_enum    TYPE     D  CREATE TYPE public.games_modality_enum AS ENUM (
    '1°',
    '1/5',
    '2/5',
    '...1°C',
    '...1°M',
    '...1/5M',
    '...1/5C',
    '...2/5M',
    '...2/5C',
    '2°',
    '3°',
    '4°',
    '5°',
    '...2°',
    '...3°',
    '...4°',
    '...5°',
    '...6°',
    '6°',
    '1/6',
    '...1/6'
);
 &   DROP TYPE public.games_modality_enum;
       public          postgres    false            S           1247    17004    games_timebet_enum    TYPE     �   CREATE TYPE public.games_timebet_enum AS ENUM (
    '11:00:00',
    '14:00:00',
    '16:00:00',
    '18:00:00',
    '21:00:00'
);
 %   DROP TYPE public.games_timebet_enum;
       public          postgres    false            V           1247    17016    numbers_timebet_enum    TYPE     �   CREATE TYPE public.numbers_timebet_enum AS ENUM (
    '11:00:00',
    '14:00:00',
    '16:00:00',
    '18:00:00',
    '21:00:00'
);
 '   DROP TYPE public.numbers_timebet_enum;
       public          postgres    false            Y           1247    17028    results_timebet_enum    TYPE     �   CREATE TYPE public.results_timebet_enum AS ENUM (
    '11:00:00',
    '14:00:00',
    '16:00:00',
    '18:00:00',
    '21:00:00'
);
 '   DROP TYPE public.results_timebet_enum;
       public          postgres    false            �            1259    17511 
   black_list    TABLE       CREATE TABLE public.black_list (
    id integer NOT NULL,
    "numberBet" character varying NOT NULL,
    "moneyBetTotal" character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "dateBet" character varying NOT NULL,
    "timeBet" public.black_list_timebet_enum NOT NULL
);
    DROP TABLE public.black_list;
       public         heap    postgres    false    878            �            1259    17510    black_list_id_seq    SEQUENCE     �   CREATE SEQUENCE public.black_list_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.black_list_id_seq;
       public          postgres    false    225            T           0    0    black_list_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.black_list_id_seq OWNED BY public.black_list.id;
          public          postgres    false    224            �            1259    17039    games    TABLE     U  CREATE TABLE public.games (
    id integer NOT NULL,
    "timeBet" public.games_timebet_enum NOT NULL,
    winner boolean DEFAULT false NOT NULL,
    user_id integer,
    group_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    favorite boolean DEFAULT false NOT NULL,
    "moneyBet" character varying NOT NULL,
    "numberBet" character varying NOT NULL,
    modality public.games_modality_enum NOT NULL,
    "dateBet" character varying NOT NULL,
    game_winner boolean DEFAULT false NOT NULL
);
    DROP TABLE public.games;
       public         heap    postgres    false    851    848            �            1259    17049    games_id_seq    SEQUENCE     �   CREATE SEQUENCE public.games_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.games_id_seq;
       public          postgres    false    214            U           0    0    games_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.games_id_seq OWNED BY public.games.id;
          public          postgres    false    215            �            1259    17050    groups    TABLE     O  CREATE TABLE public.groups (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    favorite boolean DEFAULT false NOT NULL,
    note character varying,
    squema json NOT NULL,
    total_price numeric
);
    DROP TABLE public.groups;
       public         heap    postgres    false            �            1259    17058    groups_id_seq    SEQUENCE     �   CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.groups_id_seq;
       public          postgres    false    216            V           0    0    groups_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;
          public          postgres    false    217            �            1259    17059 
   migrations    TABLE     �   CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);
    DROP TABLE public.migrations;
       public         heap    postgres    false            �            1259    17064    migrations_id_seq    SEQUENCE     �   CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.migrations_id_seq;
       public          postgres    false    218            W           0    0    migrations_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;
          public          postgres    false    219            �            1259    17074    results    TABLE     �  CREATE TABLE public.results (
    id integer NOT NULL,
    "numberBet" text NOT NULL,
    "dateBet" date NOT NULL,
    "timeBet" public.results_timebet_enum NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    "dateBetExactly" timestamp without time zone NOT NULL,
    winner_position integer NOT NULL
);
    DROP TABLE public.results;
       public         heap    postgres    false    857            �            1259    17081    results_id_seq    SEQUENCE     �   CREATE SEQUENCE public.results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public.results_id_seq;
       public          postgres    false    220            X           0    0    results_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public.results_id_seq OWNED BY public.results.id;
          public          postgres    false    221            �            1259    17082    users    TABLE     |  CREATE TABLE public.users (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    admin boolean DEFAULT false NOT NULL,
    cashier double precision DEFAULT '5000'::double precision NOT NULL
);
    DROP TABLE public.users;
       public         heap    postgres    false            �            1259    17091    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public          postgres    false    222            Y           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
          public          postgres    false    223            �           2604    17514    black_list id    DEFAULT     n   ALTER TABLE ONLY public.black_list ALTER COLUMN id SET DEFAULT nextval('public.black_list_id_seq'::regclass);
 <   ALTER TABLE public.black_list ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    224    225    225            �           2604    17092    games id    DEFAULT     d   ALTER TABLE ONLY public.games ALTER COLUMN id SET DEFAULT nextval('public.games_id_seq'::regclass);
 7   ALTER TABLE public.games ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    215    214            �           2604    17093 	   groups id    DEFAULT     f   ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);
 8   ALTER TABLE public.groups ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    217    216            �           2604    17094    migrations id    DEFAULT     n   ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);
 <   ALTER TABLE public.migrations ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218            �           2604    17096 
   results id    DEFAULT     h   ALTER TABLE ONLY public.results ALTER COLUMN id SET DEFAULT nextval('public.results_id_seq'::regclass);
 9   ALTER TABLE public.results ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    221    220            �           2604    17097    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    223    222            M          0    17511 
   black_list 
   TABLE DATA           t   COPY public.black_list (id, "numberBet", "moneyBetTotal", created_at, updated_at, "dateBet", "timeBet") FROM stdin;
    public          postgres    false    225   �C       B          0    17039    games 
   TABLE DATA           �   COPY public.games (id, "timeBet", winner, user_id, group_id, created_at, updated_at, favorite, "moneyBet", "numberBet", modality, "dateBet", game_winner) FROM stdin;
    public          postgres    false    214   �C       D          0    17050    groups 
   TABLE DATA           j   COPY public.groups (id, user_id, created_at, updated_at, favorite, note, squema, total_price) FROM stdin;
    public          postgres    false    216   �C       F          0    17059 
   migrations 
   TABLE DATA           ;   COPY public.migrations (id, "timestamp", name) FROM stdin;
    public          postgres    false    218   	D       H          0    17074    results 
   TABLE DATA           �   COPY public.results (id, "numberBet", "dateBet", "timeBet", created_at, updated_at, "dateBetExactly", winner_position) FROM stdin;
    public          postgres    false    220    E       J          0    17082    users 
   TABLE DATA           b   COPY public.users (id, name, email, password, created_at, updated_at, admin, cashier) FROM stdin;
    public          postgres    false    222   E       Z           0    0    black_list_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.black_list_id_seq', 25, true);
          public          postgres    false    224            [           0    0    games_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.games_id_seq', 103501, true);
          public          postgres    false    215            \           0    0    groups_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.groups_id_seq', 100327, true);
          public          postgres    false    217            ]           0    0    migrations_id_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('public.migrations_id_seq', 31, true);
          public          postgres    false    219            ^           0    0    results_id_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('public.results_id_seq', 141, true);
          public          postgres    false    221            _           0    0    users_id_seq    SEQUENCE SET     ;   SELECT pg_catalog.setval('public.users_id_seq', 29, true);
          public          postgres    false    223            �           2606    17099 %   groups PK_659d1483316afb28afd3a90646e 
   CONSTRAINT     e   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public.groups DROP CONSTRAINT "PK_659d1483316afb28afd3a90646e";
       public            postgres    false    216            �           2606    17520 )   black_list PK_6969ca1c62bdf4fef47a85b8195 
   CONSTRAINT     i   ALTER TABLE ONLY public.black_list
    ADD CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.black_list DROP CONSTRAINT "PK_6969ca1c62bdf4fef47a85b8195";
       public            postgres    false    225            �           2606    17101 )   migrations PK_8c82d7f526340ab734260ea46be 
   CONSTRAINT     i   ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.migrations DROP CONSTRAINT "PK_8c82d7f526340ab734260ea46be";
       public            postgres    false    218            �           2606    17105 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public            postgres    false    222            �           2606    17107 $   games PK_c9b16b62917b5595af982d66337 
   CONSTRAINT     d   ALTER TABLE ONLY public.games
    ADD CONSTRAINT "PK_c9b16b62917b5595af982d66337" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.games DROP CONSTRAINT "PK_c9b16b62917b5595af982d66337";
       public            postgres    false    214            �           2606    17109 &   results PK_e8f2a9191c61c15b627c117a678 
   CONSTRAINT     f   ALTER TABLE ONLY public.results
    ADD CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.results DROP CONSTRAINT "PK_e8f2a9191c61c15b627c117a678";
       public            postgres    false    220            �           2606    17111 $   users UQ_97672ac88f789774dd47f7c8be3 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3";
       public            postgres    false    222            �           2606    17112 $   games FK_4476c8f7870590ccb0070016866    FK CONSTRAINT     �   ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_4476c8f7870590ccb0070016866" FOREIGN KEY (group_id) REFERENCES public.groups(id);
 P   ALTER TABLE ONLY public.games DROP CONSTRAINT "FK_4476c8f7870590ccb0070016866";
       public          postgres    false    3238    216    214            �           2606    17117 %   groups FK_9f71bda715870718997ed62f64b    FK CONSTRAINT     �   ALTER TABLE ONLY public.groups
    ADD CONSTRAINT "FK_9f71bda715870718997ed62f64b" FOREIGN KEY (user_id) REFERENCES public.users(id);
 Q   ALTER TABLE ONLY public.groups DROP CONSTRAINT "FK_9f71bda715870718997ed62f64b";
       public          postgres    false    222    216    3244            �           2606    17122 $   games FK_c26f4ceea870c6b52d767c2e24f    FK CONSTRAINT     �   ALTER TABLE ONLY public.games
    ADD CONSTRAINT "FK_c26f4ceea870c6b52d767c2e24f" FOREIGN KEY (user_id) REFERENCES public.users(id);
 P   ALTER TABLE ONLY public.games DROP CONSTRAINT "FK_c26f4ceea870c6b52d767c2e24f";
       public          postgres    false    214    3244    222            M      x������ � �      B      x������ � �      D      x������ � �      F   �   x�U�;N0��� ���B�T�p� ?)�h{Ā��H�|�|��|}?A�%��IE27�B�-��ҥ���`Sa�'��/I�8ER��)�d�P+x�.��%1��I:�rK3��Wp!Ւ\��)��.��p�@�y�$`[Y��4ѭ	�t��a0�Wu!a�>�G8���v�`˙�_!ag,���/$�+�}yt�@�e���*���I�-A��k�[���k��      H      x������ � �      J     x�}�ɒ�@E��.ܚ�ɪ��r ��D�� �� ���_��atw�����]�si�n�]Vr]5��!X�����g�n��u�͕唳i+�9$��A����|�����[;�6�0Ĥq�*&*�UBU A�h)1a�R+��?���Q��8�&g� ڟ���)(L�l5��b��{a���h~�d#�M2����"�b�R�"��Bj�I���|���^r_�� q�xi�@D���1z�N����n��g���p͖g�Zm�n/�d4��10��RET�Te ������H�(�o㎑��|�|�8/�p��K�Y^�Z�IQ�.�<vH/��;@�=��SL Y�T�{D�T1V!Q!�#�������͘�Y��&����[{��c�ބ�r��]��O>�ll�����H���kSS!R	����\#z���*_�������Gq�n��Y����g�]��Sh;&��QYm���!�Ӷ�����%����ߙ2�����koA��WwWAX%p$��A�@�R�(�     